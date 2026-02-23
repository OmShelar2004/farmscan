from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
from google import genai

app = Flask(__name__)
CORS(app)

# ==============================
# LOAD MODELS
# ==============================

tomato_model = load_model("model/tomato_model.h5")
potato_model = load_model("model/potato_model.h5")

# ==============================
# CLASS LABELS
# ==============================

tomato_classes = ["early_blight", "late_blight", "healthy"]
potato_classes = ["early_blight", "late_blight", "healthy"]

# ==============================
# GEMINI SETUP
# ==============================

API_KEY = "AIzaSyA0WFX6oYLJ_PBf0fxi84tD3EB0xCqihUE"  
client = genai.Client(api_key=API_KEY)

# ==============================
# IMAGE PREDICTION FUNCTION
# ==============================

def predict_image(model, img_path, class_names):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    predictions = model.predict(img_array)
    confidence = float(np.max(predictions))
    class_index = np.argmax(predictions)
    disease = class_names[class_index]

    return disease, confidence


# ==============================
# ROUTES
# ==============================

@app.route("/")
def home():
    return "FarmScan Backend Running 🚀"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        crop = request.form.get("crop")

        if not crop:
            return jsonify({"error": "Crop not provided"}), 400

        filepath = "temp.jpg"
        file.save(filepath)

        if crop == "tomato":
            disease, confidence = predict_image(tomato_model, filepath, tomato_classes)

        elif crop == "potato":
            disease, confidence = predict_image(potato_model, filepath, potato_classes)

        else:
            os.remove(filepath)
            return jsonify({"error": "Invalid crop selected"}), 400

        os.remove(filepath)

        return jsonify({
            "crop": crop,
            "disease": disease,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# CHATBOT ROUTE
# ==============================

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        message = data.get("message")

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=message
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        return jsonify({
            "reply": "Sorry, I couldn't answer right now.",
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
