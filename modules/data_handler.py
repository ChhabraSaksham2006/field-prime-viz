import numpy as np
import scipy.io
from PIL import Image
import os

def load_indian_pines_dataset(data_folder_path):
    """
    Loads and preprocesses the Indian Pines hyperspectral dataset.

    Args:
        data_folder_path (str): The path to the folder containing the dataset.

    Returns:
        tuple: A tuple containing:
            - hypercube (np.ndarray): The normalized hyperspectral data cube.
            - ground_truth (np.ndarray): The ground truth data.
    """
    corrected_path = os.path.join(data_folder_path, 'Indian_pines_corrected.mat')
    gt_path = os.path.join(data_folder_path, 'Indian_pines_gt.mat')

    if not os.path.isfile(corrected_path) or not os.path.isfile(gt_path):
        raise FileNotFoundError(f'Dataset files not found in \'{data_folder_path}\'. Please download them as instructed.')

    # Load the .mat files
    corrected_mat = scipy.io.loadmat(corrected_path)
    gt_mat = scipy.io.loadmat(gt_path)

    # The actual data is usually in a key that matches the filename (or similar)
    # We find the key that contains the main data array
    hypercube_key = [k for k, v in corrected_mat.items() if isinstance(v, np.ndarray) and v.ndim > 1][0]
    gt_key = [k for k, v in gt_mat.items() if isinstance(v, np.ndarray) and v.ndim > 1][0]

    hypercube = corrected_mat[hypercube_key]
    ground_truth = gt_mat[gt_key]

    # Normalize the hypercube data to the range [0, 1]
    hypercube = hypercube.astype(np.float64)
    hypercube -= np.min(hypercube)
    hypercube /= np.max(hypercube)

    return hypercube, ground_truth

def create_rgb_visualization(hypercube: np.ndarray):
    """
    Creates a 3-channel RGB visualization from the hyperspectral cube.

    Args:
        hypercube (np.ndarray): The normalized hyperspectral data cube.

    Returns:
        Image: A PIL Image object for the RGB visualization.
    """
    # Bands for RGB visualization (adjust if necessary for different datasets)
    red_band = 29
    green_band = 19
    blue_band = 9

    rgb_image = np.stack([
        hypercube[:, :, red_band],
        hypercube[:, :, green_band],
        hypercube[:, :, blue_band]
    ], axis=-1)

    # Perform contrast stretching to improve visibility (similar to imadjust)
    # This simple version clips the data at the 2nd and 98th percentiles
    p2, p98 = np.percentile(rgb_image, (2, 98))
    rgb_image_stretched = np.clip(rgb_image, p2, p98)
    rgb_image_stretched = (rgb_image_stretched - p2) / (p98 - p2)

    # Convert to an 8-bit image for display
    rgb_image_8bit = (rgb_image_stretched * 255).astype(np.uint8)
    
    return Image.fromarray(rgb_image_8bit)

if __name__ == '__main__':
    # Example of how to use the functions
    # Note: This assumes the 'data' folder is in the parent directory of 'modules'
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_folder = os.path.join(os.path.dirname(current_dir), 'data')
    
    hypercube, ground_truth = load_indian_pines_dataset(data_folder)
    rgb_image = create_rgb_visualization(hypercube)
    rgb_image.save('indian_pines_rgb_preview.png')
    print(f"Hypercube shape: {hypercube.shape}")
    print(f"Ground truth shape: {ground_truth.shape}")
    print("RGB preview saved as 'indian_pines_rgb_preview.png'")
    # Example of how to use the functions
    # Note: This assumes the 'data' folder is in the parent directory of 'modules'
