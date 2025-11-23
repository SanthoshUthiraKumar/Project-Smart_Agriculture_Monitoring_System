import numpy as np
import pickle
import tensorflow as tf
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from PIL import Image
import io
import os
import random

# Initialize the Flask application
app = Flask(__name__)

# --- 1. Load the model and scalers ---
# Get the absolute path to the directory this script is in
# This makes it work reliably.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, 'yield_prediction_model.h5')
SCALER_SPECTRAL_PATH = os.path.join(BASE_DIR, 'scaler_spectral.pkl')
SCALER_IOT_PATH = os.path.join(BASE_DIR, 'scaler_iot.pkl')

try:
    # Load the trained model
    model = tf.keras.models.load_model(MODEL_PATH)
    
    # Load the spectral scaler
    with open(SCALER_SPECTRAL_PATH, 'rb') as f:
        scaler_spectral = pickle.load(f)
    
    # Load the IoT scaler
    with open(SCALER_IOT_PATH, 'rb') as f:
        scaler_iot = pickle.load(f)
        
    print(f"* Model and scalers loaded successfully from {BASE_DIR}")
    
    # Get the expected number of features from the loaded scalers
    NUM_SPECTRAL_FEATURES = scaler_spectral.n_features_in_
    NUM_IOT_FEATURES = scaler_iot.n_features_in_
    print(f"* Model expects {NUM_SPECTRAL_FEATURES} spectral features and {NUM_IOT_FEATURES} IoT features.")

except Exception as e:
    print(f"* CRITICAL ERROR loading model or scalers: {e}")
    model = None # Set model to None to handle errors gracefully

# --- 2. Define the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded. Check server logs.'}), 500

    try:
        # Get the JSON data sent from your Java application
        data = request.get_json()

        # --- 3. Preprocess the Input Data ---
        
        # We expect data in the format:
        # { "spectral": [0.1, 0.2, ...], "iot": [25.5, 60.1] }
        spectral_data = np.array(data['spectral']).reshape(1, -1)
        iot_data = np.array(data['iot']).reshape(1, -1)
        
        # Check if the input data has the correct number of features
        if spectral_data.shape[1] != NUM_SPECTRAL_FEATURES:
            return jsonify({'error': f'Expected {NUM_SPECTRAL_FEATURES} spectral features, got {spectral_data.shape[1]}'}), 400
        if iot_data.shape[1] != NUM_IOT_FEATURES:
            return jsonify({'error': f'Expected {NUM_IOT_FEATURES} IoT features, got {iot_data.shape[1]}'}), 400

        # Scale the data using the *loaded* scalers
        spectral_scaled = scaler_spectral.transform(spectral_data)
        iot_scaled = scaler_iot.transform(iot_data)
        
        # Reshape spectral data for the 1D-CNN
        spectral_reshaped = spectral_scaled.reshape(1, NUM_SPECTRAL_FEATURES, 1)

        # --- 4. Make a Prediction ---
        prediction = model.predict({
            'spectral_input': spectral_reshaped,
            'iot_input': iot_scaled
        })
        
        # Get the single scalar value from the (1,1) numpy array
        predicted_yield = float(prediction[0][0])

        # --- 5. Return the Result ---
        print(f"Prediction successful. Yield: {predicted_yield}")
        return jsonify({'predicted_yield': predicted_yield})

    except KeyError as e:
        print(f"ERROR: Missing key in request: {e}")
        return jsonify({'error': f'Missing key in request data: {e}'}), 400
    except Exception as e:
        print(f"ERROR: An error occurred during prediction: {e}")
        return jsonify({'error': f'An error occurred: {e}'}), 500

# --- 6. Run the API Server ---
if __name__ == '__main__':
    # Run the Flask app on port 5000, accessible from any IP
    app.run(debug=True, host='0.0.0.0', port=5000)
    
@app.route('/predict-disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    
    try:
        # 1. Read the image
        img = Image.open(file.stream)
        img = img.resize((224, 224)) # Standard size for CNNs
        
        # 2. Preprocess (Convert to array)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # 3. Make Prediction
        # If you have a real model: 
        # preds = disease_model.predict(img_array)
        # class_id = np.argmax(preds[0])
        
        # --- SIMULATED LOGIC (For demonstration) ---
        # We will simulate a detection based on random chance or filename
        # In a real project, you MUST replace this with model.predict()
        import random
        diseases = ['Healthy', 'Early Blight', 'Late Blight', 'Leaf Curl']
        prediction = random.choice(diseases)
        confidence = round(random.uniform(85.0, 99.9), 2)
        # -------------------------------------------

        return jsonify({
            'disease': prediction,
            'confidence': f"{confidence}%",
            'advice': get_advice(prediction)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_advice(disease):
    advice_dict = {
        'Healthy': 'Crop is in good condition. Continue monitoring.',
        'Early Blight': 'Apply copper-based fungicides. Improve air circulation.',
        'Late Blight': 'Remove infected leaves immediately. Avoid overhead irrigation.',
        'Leaf Curl': 'Control whitefly population. Use resistant crop varieties.'
    }
    return advice_dict.get(disease, 'Consult an expert.')

@app.route('/predict-disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    
    try:
        # 1. Read and Resize Image
        img = Image.open(file.stream)
        img = img.resize((224, 224)) 
        
        # 2. In a real scenario, you would preprocess and pass to a CNN model:
        # img_array = np.array(img) / 255.0
        # preds = disease_model.predict(np.expand_dims(img_array, axis=0))
        
        # --- SIMULATED LOGIC (Placeholder until you train a disease model) ---
        diseases = ['Healthy', 'Early Blight', 'Late Blight', 'Leaf Curl', 'Bacterial Spot']
        prediction = random.choice(diseases)
        confidence = round(random.uniform(85.0, 99.0), 2)
        
        return jsonify({
            'disease': prediction,
            'confidence': f"{confidence}%",
            'advice': get_advice(prediction)
        })

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

def get_advice(disease):
    advice_dict = {
        'Healthy': 'Plant is healthy. Maintain current care.',
        'Early Blight': 'Use copper-based fungicides and improve air circulation.',
        'Late Blight': 'Remove infected leaves immediately. Avoid overhead watering.',
        'Leaf Curl': 'Control pests (whiteflies/thrips). Use resistant varieties.',
        'Bacterial Spot': 'Avoid wet foliage. Apply copper sprays.'
    }
    return advice_dict.get(disease, 'Consult an expert.')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)