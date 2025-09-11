from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import os
import base64
import numpy as np
from PIL import Image
import io
import torch

# Import our custom modules
from modules.data_handler import load_hyperspectral_data, create_rgb_visualization
from modules.iot_generator import generate_iot_data
from modules.model_handler import run_prediction, CropClassifier, PATCH_SIZE

app = Flask(__name__)
CORS(app)

# --- Global Variables (to store data in memory for the session) ---
hypercube_data = None
ground_truth_data = None
trained_model = None
prediction_map_data = None
num_classes_global = 16 # Indian Pines has 16 classes (0-15, 0 is background)

# --- Configuration ---
DATA_FOLDER = 'data'
MODEL_PATH = os.path.join('models', 'crop_classifier.pth') # PyTorch model path

# --- Load Model on Startup ---
# @app.before_first_request # Deprecated in newer Flask versions
def _load_trained_model_on_startup():
    global trained_model, num_classes_global
    # We need to know num_classes to initialize the model.
    # A robust way is to load data first to determine it.
    # For simplicity here, we'll assume it's 16 (Indian Pines classes).
    # In a real app, you might save num_classes with the model or derive it.

    if os.path.exists(MODEL_PATH):
        try:
            trained_model = CropClassifier(num_classes=num_classes_global)
            trained_model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
            trained_model.eval() # Set to evaluation mode
            print(f"Successfully loaded trained PyTorch model from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading PyTorch model: {e}")
            trained_model = None
    else:
        print(f"PyTorch model not found at {MODEL_PATH}. Please run train.py first.")

# Call the function directly when the app starts
_load_trained_model_on_startup()

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/load_data')
def api_load_data():
    global hypercube_data, ground_truth_data
    try:
        hypercube_data, ground_truth_data = load_hyperspectral_data(DATA_FOLDER)
        rgb_image_pil = create_rgb_visualization(hypercube_data)
        
        # Convert PIL Image to base64 string
        buffered = io.BytesIO()
        rgb_image_pil.save(buffered, format="PNG")
        rgb_image_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return jsonify({'success': True, 'rgb_image_b64': f'data:image/png;base64,{rgb_image_b64}', 'hypercube_shape': hypercube_data.shape})
    except FileNotFoundError as e:
        return jsonify({'success': False, 'message': str(e)}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error loading data: {str(e)}'}), 500

@app.route('/api/run_analysis')
def api_run_analysis():
    global prediction_map_data
    if hypercube_data is None:
        return jsonify({'success': False, 'message': 'Please load hyperspectral data first.'}), 400
    if trained_model is None:
        return jsonify({'success': False, 'message': 'Trained PyTorch model not found. Please run train.py first.'}), 400

    try:
        # IoT Data
        iot_data = generate_iot_data(24) # Simulate 24 hours of data

        # AI Prediction
        prediction_map_data, class_summary = run_prediction(trained_model, hypercube_data)
        
        # Convert prediction map to a flat list for easy transfer to JS
        prediction_map_flat = prediction_map_data.flatten().tolist()

        return jsonify({'success': True, 'iot_data': iot_data, 'prediction_map': prediction_map_flat, 'class_summary': class_summary})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error running analysis: {str(e)}'}), 500

@app.route('/api/get_spectral_signature')
def api_get_spectral_signature():
    x = int(request.args.get('x'))
    y = int(request.args.get('y'))

    if hypercube_data is None:
        return jsonify({'success': False, 'message': 'Hyperspectral data not loaded.'}), 400

    try:
        # Extract the full spectral vector for the clicked pixel
        spectral_signature = hypercube_data[y, x, :].tolist()
        return jsonify({'success': True, 'spectral_signature': spectral_signature})
    except IndexError:
        return jsonify({'success': False, 'message': 'Invalid pixel coordinates.'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error getting spectral signature: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True allows auto-reloading and better error messages