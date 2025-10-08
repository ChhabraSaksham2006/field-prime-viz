import numpy as np
import scipy.io
from PIL import Image
import os
import matplotlib.pyplot as plt
import io
import base64

def load_hyperspectral_data(data_folder_path: str):
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

def calculate_ndvi(hypercube: np.ndarray, nir_band: int = 50, red_band: int = 29):
    """
    Calculate Normalized Difference Vegetation Index (NDVI) from hyperspectral data.
    
    Args:
        hypercube (np.ndarray): The hyperspectral data cube
        nir_band (int): Index of the near-infrared band
        red_band (int): Index of the red band
        
    Returns:
        np.ndarray: NDVI values ranging from -1 to 1
    """
    # Extract NIR and Red bands
    nir = hypercube[:, :, nir_band]
    red = hypercube[:, :, red_band]
    
    # Calculate NDVI
    # Add small epsilon to avoid division by zero
    epsilon = 1e-10
    ndvi = (nir - red) / (nir + red + epsilon)
    
    # Clip values to valid NDVI range [-1, 1]
    ndvi = np.clip(ndvi, -1, 1)
    
    return ndvi

def create_healthmap_visualization(hypercube: np.ndarray, index_type: str = 'ndvi'):
    """
    Creates a health map visualization from hyperspectral data.
    
    Args:
        hypercube (np.ndarray): The hyperspectral data cube
        index_type (str): Type of vegetation index to use ('ndvi', 'gndvi', etc.)
        
    Returns:
        tuple: (base64_image, index_values)
            - base64_image: Base64 encoded string of the health map image
            - index_values: Raw index values for further analysis
    """
    if index_type.lower() == 'ndvi':
        index_values = calculate_ndvi(hypercube)
    else:
        # Default to NDVI if index type not recognized
        index_values = calculate_ndvi(hypercube)
    
    # Create a colormap visualization
    plt.figure(figsize=(8, 8))
    plt.imshow(index_values, cmap='RdYlGn', vmin=-1, vmax=1)
    plt.colorbar(label='NDVI')
    plt.title('Vegetation Health Map')
    plt.axis('off')
    
    # Save the figure to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    plt.close()
    buf.seek(0)
    
    # Convert to base64 string
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return f"data:image/png;base64,{img_str}", index_values

if __name__ == '__main__':
    # Example of how to use the functions
    # Note: This assumes the 'data' folder is in the parent directory of 'modules'
    try:
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        hc, gt = load_hyperspectral_data(data_dir)
        rgb_img = create_rgb_visualization(hc)
        print(f"Hypercube shape: {hc.shape}")
        print(f"Ground truth shape: {gt.shape}")
        print(f"RGB image mode: {rgb_img.mode}")
        
        # Test health map
        healthmap_img, ndvi_values = create_healthmap_visualization(hc)
        print(f"NDVI range: {np.min(ndvi_values)} to {np.max(ndvi_values)}")
        # rgb_img.show() # Uncomment to display the image if running locally
    except FileNotFoundError as e:
        print(e)
