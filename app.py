# main_ver = "mock_main.py"
from flask import Flask, request, jsonify
from flask_cors import CORS
from mock_main import process_user_message, elevenlabs_tts, cleanup_audio_files
import os
import uuid



app = Flask(__name__)
CORS(app)

# Make sure static folder exists
os.makedirs("static", exist_ok=True)

@app.route("/")
def index():
    return "RES-Q backend is running ✅"

@app.route("/process_text", methods=["POST"])
def process_text():
    data = request.get_json()
    user_text = data.get("text", "").strip()

    if not user_text:
        return jsonify({"error": "Empty text"}), 400

    try:
        # 1. Process user message using Gemini logic
        ai_response = process_user_message(user_text)

        # 2. Generate TTS using ElevenLabs
        audio_filename = f"static/audio_{uuid.uuid4().hex}.mp3"
        elevenlabs_tts(ai_response, filename=audio_filename)

        # 3. Return both text + audio URL
        return jsonify({
            "response_text": ai_response,
            "audio_url": f"http://localhost:5000/{audio_filename}"
        })

    except Exception as e:
        print("Error in /process_text:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
