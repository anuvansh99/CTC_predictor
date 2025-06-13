from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import pickle
import os
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# Load model at startup
model_path = os.path.join(os.path.dirname(__file__), 'model', 'ctc_predictor_model.pkl')
with open(model_path, 'rb') as file:
    loaded_model = pickle.load(file)

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Prepare input DataFrame
        sample_data = pd.DataFrame({
            'CGPA': [float(data['cgpa'])],
            'gender': [int(data['gender'])],
            'branch_name': [data['branch']]
        })
        sample_data['CGPA_squared'] = sample_data['CGPA'] ** 2

        # Predict and clip to minimum CTC
        raw_prediction = loaded_model.predict(sample_data)[0]
        predicted_ctc = max(raw_prediction, 3.30)

        return jsonify({'prediction': round(predicted_ctc, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
