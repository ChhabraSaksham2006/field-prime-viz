import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from sklearn.model_selection import train_test_split

PATCH_SIZE = 11

class CropClassifier(nn.Module):
    def __init__(self, num_classes):
        super(CropClassifier, self).__init__()
        
        # CNN Block 1
        self.conv1 = nn.Conv3d(in_channels=1, out_channels=8, kernel_size=(3, 3, 7), padding='same')
        self.pool1 = nn.MaxPool3d(kernel_size=(2, 2, 2))
        
        # CNN Block 2
        self.conv2 = nn.Conv3d(in_channels=8, out_channels=16, kernel_size=(3, 3, 5), padding='same')
        self.pool2 = nn.MaxPool3d(kernel_size=(2, 2, 2))
        
        # Bridge to LSTM: Calculate the output shape after CNN blocks
        # Assuming input_shape (1, PATCH_SIZE, PATCH_SIZE, num_bands)
        # After conv1 (padding='same'): (8, PATCH_SIZE, PATCH_SIZE, num_bands)
        # After pool1 (kernel_size=2): (8, PATCH_SIZE//2, PATCH_SIZE//2, num_bands//2)
        # After conv2 (padding='same'): (16, PATCH_SIZE//2, PATCH_SIZE//2, num_bands//2)
        # After pool2 (kernel_size=2): (16, PATCH_SIZE//4, PATCH_SIZE//4, num_bands//4)
        
        # Example: (1, 11, 11, 200) -> (8, 11, 11, 200) -> (8, 5, 5, 100) -> (16, 5, 5, 100) -> (16, 2, 2, 50)
        # The actual output shape will depend on num_bands. Let's calculate dynamically.
        
        # LSTM Layer
        # The input to LSTM will be (batch_size, sequence_length, input_size)
        # We need to flatten the spatial and channel dimensions into input_size
        # and the spectral dimension becomes sequence_length.
        
        # Dummy forward pass to calculate LSTM input size
        # This is a common trick in PyTorch to get dynamic shapes
        self._to_lstm_input_size = None
        
        self.lstm = nn.LSTM(input_size=self._get_lstm_input_size(), hidden_size=128, batch_first=True)
        self.dropout = nn.Dropout(0.4)
        
        # Output Layer
        self.fc = nn.Linear(in_features=128, out_features=num_classes)
        
    def _get_lstm_input_size(self):
        # This method will be called during __init__ to set up the LSTM layer
        # It requires a dummy input to calculate the shape
        # We'll assume a typical input shape for Indian Pines (1, 11, 11, 200)
        dummy_input = torch.randn(1, 1, PATCH_SIZE, PATCH_SIZE, 200) # (batch, channel, depth, height, width)
        
        x = self.pool1(F.relu(self.conv1(dummy_input)))
        x = self.pool2(F.relu(self.conv2(x)))
        
        # Reshape for LSTM: (batch_size, sequence_length, features)
        # x.shape will be (batch_size, channels, depth, height, width)
        # We want (batch_size, depth, channels * height * width)
        
        # Flatten channels, height, width into features
        features_flat = x.shape[1] * x.shape[3] * x.shape[4] # channels * height * width
        sequence_length = x.shape[2] # depth
        
        return features_flat

    def forward(self, x):
        # x shape: (batch_size, 1, PATCH_SIZE, PATCH_SIZE, num_bands)
        
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.pool2(F.relu(self.conv2(x)))
        
        # Reshape for LSTM
        # x.shape: (batch_size, channels, depth, height, width)
        # Permute to (batch_size, depth, channels, height, width)
        x = x.permute(0, 2, 1, 3, 4) 
        
        # Flatten channels, height, width into features
        batch_size, sequence_length, _, _, _ = x.shape
        x = x.reshape(batch_size, sequence_length, -1)
        
        # LSTM
        lstm_out, _ = self.lstm(x)
        
        # Take the output from the last time step
        x = lstm_out[:, -1, :]
        
        x = self.dropout(x)
        x = self.fc(x)
        
        return x

def prepare_training_data(hypercube, ground_truth):
    """
    Extracts 3D patches from the hypercube to be used for training.
    Returns PyTorch tensors.
    """
    pad_width = PATCH_SIZE // 2
    padded_cube = np.pad(hypercube, ((pad_width, pad_width), (pad_width, pad_width), (0, 0)), mode='constant')

    patches = []
    labels = []
    coords = np.argwhere(ground_truth > 0)
    for r, c in coords:
        label = ground_truth[r, c]
        patch = padded_cube[r:r+PATCH_SIZE, c:c+PATCH_SIZE, :]
        patches.append(patch)
        labels.append(label)

    X = np.array(patches, dtype=np.float32)
    y = np.array(labels, dtype=np.int64) - 1 # PyTorch expects 0-indexed labels
    
    # Add a channel dimension for PyTorch Conv3D (batch, channel, depth, height, width)
    X = np.expand_dims(X, axis=1) 
    
    return torch.from_numpy(X), torch.from_numpy(y)

def run_prediction(model, hypercube):
    """
    Performs a pixel-by-pixel classification on the entire hypercube.
    Uses batch processing for improved performance.
    """
    height, width, _ = hypercube.shape
    pad_width = PATCH_SIZE // 2
    padded_cube = np.pad(hypercube, ((pad_width, pad_width), (pad_width, pad_width), (0, 0)), mode='constant')

    prediction_map = np.zeros((height, width), dtype=np.int64)
    batch_size = 128  # Process 128 pixels at a time

    model.eval()  # Set model to evaluation mode
    with torch.no_grad():  # Disable gradient calculation for inference
        # Process the image in batches for better performance
        for r in range(0, height, 1):  # Still process one row at a time
            all_patches = []
            for c in range(width):
                patch = padded_cube[r:r+PATCH_SIZE, c:c+PATCH_SIZE, :]
                all_patches.append(patch)
            
            # Convert all patches to numpy array
            all_patches = np.array(all_patches, dtype=np.float32)
            all_patches = np.expand_dims(all_patches, axis=1)  # Add channel dimension
            
            # Process in batches
            for i in range(0, width, batch_size):
                batch_patches = all_patches[i:min(i+batch_size, width)]
                
                # Convert to PyTorch tensor
                input_tensor = torch.from_numpy(batch_patches)
                
                outputs = model(input_tensor)
                predicted_labels = torch.argmax(outputs, dim=1).cpu().numpy()
                prediction_map[r, i:min(i+batch_size, width)] = predicted_labels + 1  # Add 1 to match original label values

    # Create a summary of the classification
    unique_classes, counts = np.unique(prediction_map, return_counts=True)
    class_summary = [{'crop_type_id': int(cls), 'pixel_count': int(count)} for cls, count in zip(unique_classes, counts) if cls != 0]

    return prediction_map, class_summary

if __name__ == '__main__':
    # Example of how to use the functions
    # This part is for testing the module independently
    pass