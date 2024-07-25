from flask import Flask, request, jsonify
import util
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_ORIGINS'] = [
    'http://127.0.0.1:5173'
]

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing data in request body'}), 400

    location = data.get('location')
    total_sqft = data.get('area')
    bhk = data.get('bhk')
    bath = data.get('bath')

    try:
        return jsonify({
            'estimated_price': util.get_estimated_price(location,total_sqft,bhk,bath)
        })
    except Exception as e:
        return jsonify({
            'error' : str(e)
        })


if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)