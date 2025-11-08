from dotenv import load_dotenv
import os
import requests
import speech_recognition as sr
from playsound import playsound
import threading
import time

load_dotenv()

# --- API Keys ---
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

# --- Initialize recognizer and set Gemini Model ---
recognizer = sr.Recognizer()
model_name = "models/gemini-2.5-flash-lite"  # lighter/faster than 2.5-pro

def transcribe_audio():
    with sr.Microphone() as source:
        print("🎙 Say something...")
        audio = recognizer.listen(source)
    try:
        text = recognizer.recognize_google(audio)
        print("📝 You said:", text)
        return text
    except sr.UnknownValueError:
        print("Could not understand audio.")
        return None

def gemini_reply(prompt):
    """Return the Gemini response text."""
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(prompt)
    text = response.text
    print("🤖 Gemini:", text)
    return text

def elevenlabs_tts(text, filename="output.mp3"):
    """Generate audio for a chunk of text."""
    url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb"  # replace with your voice ID
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()  # Raise error if request fails

    # write the file
    with open(filename, "wb") as f:
        f.write(response.content)

    # tiny pause to make sure file is flushed to disk
    time.sleep(0.1)

    return filename

def play_audio(file_path):
    """Play the given audio file."""
    playsound(file_path)

def speak_text(text):
    audio_file = elevenlabs_tts(text, filename="output.mp3")
    play_audio(audio_file)


def generate_and_speak(prompt):
    """Generate Gemini response and play audio in real-time."""
    text = gemini_reply(prompt)
    speak_text(text)

def main():
    user_input = transcribe_audio()
    if user_input:
        # Run Gemini + TTS in a separate thread to keep main program responsive
        threading.Thread(target=generate_and_speak, args=(user_input,)).start()

if __name__ == "__main__":
    main()
