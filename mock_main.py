from dotenv import load_dotenv
import os
import glob
import speech_recognition as sr
import threading
import time
import re
from pydub import AudioSegment
from pydub.playback import _play_with_simpleaudio
from ip_utils import start_ip_check
from context_manager import process_user_message, clear_session

# --- Load environment variables ---
load_dotenv()

# --- Optional callback for Flask updates ---
ai_callback = None

def set_callback(callback_fn):
    """Frontend sets this to get AI updates via Flask."""
    global ai_callback
    ai_callback = callback_fn


# --- API Keys ---
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

# --- Initialize recognizer ---
recognizer = sr.Recognizer()

# --- Global flags ---
stop_audio_flag = False
audio_thread = None
listening = True


# --- Clean up old audio files ---
def cleanup_audio_files():
    files = glob.glob("chunk_*.mp3")
    for f in files:
        try:
            os.remove(f)
        except Exception as e:
            print(f"Failed to delete {f}: {e}")


# --- Mock ElevenLabs TTS (for testing) ---
def elevenlabs_tts(text, filename="output.mp3"):
    """
    Instead of calling the real ElevenLabs API, generate a short beep tone for testing.
    """
    from pydub.generators import Sine
    tone = Sine(440).to_audio_segment(duration=500)
    tone.export(filename, format="mp3")
    print(f"[MOCK TTS] Generated audio for: {text[:50]}...")
    return filename


# --- Play audio interruptibly ---
def play_audio_interruptible(file_path):
    global stop_audio_flag
    sound = AudioSegment.from_file(file_path)
    play_obj = _play_with_simpleaudio(sound)

    while play_obj.is_playing():
        if stop_audio_flag:
            play_obj.stop()
            break
        time.sleep(0.05)


# --- Speak Gemini response and notify frontend ---
def speak_text_interruptible(prompt):
    """Generate AI response, notify frontend, and speak it."""
    cleanup_audio_files()  # remove old audio
    text = process_user_message(prompt)

    # Notify the Flask backend (frontend pulls this)
    if ai_callback:
        try:
            ai_callback(text)
        except Exception as e:
            print(f"[Callback Error] {e}")

    # Show context (debug)
    try:
        from context_manager import show_current_context
        show_current_context()
    except ImportError:
        print("[DEBUG] show_current_context not available")

    # Speak the AI's response in chunks
    chunks = re.split(r'(?<=[.?!])\s+', text)
    global stop_audio_flag
    stop_audio_flag = False

    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
        if stop_audio_flag:
            break
        audio_file = elevenlabs_tts(chunk, filename=f"chunk_{i}.mp3")
        play_audio_interruptible(audio_file)


# --- Continuous voice recognition loop ---
def listen_loop():
    global listening, stop_audio_flag, audio_thread
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        print("🎙 Listening continuously. Speak and pause to trigger AI response...")

        while listening:
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=8)
                user_input = recognizer.recognize_google(audio)

                if user_input.strip():
                    print(f"📝 You said: {user_input}")

                    # Stop current playback
                    stop_audio_flag = True
                    if audio_thread and audio_thread.is_alive():
                        audio_thread.join()

                    # Start new AI response in a thread
                    audio_thread = threading.Thread(
                        target=speak_text_interruptible, args=(user_input,)
                    )
                    audio_thread.start()

            except sr.WaitTimeoutError:
                continue
            except sr.UnknownValueError:
                continue
            except KeyboardInterrupt:
                listening = False
                break


# --- Optional IP Geolocation callback (debug info) ---
def ip_callback(info):
    geo = info.get("geolocation", {})
    country = geo.get("country")
    org = geo.get("org") or geo.get("isp") or ""
    if "Vultr" in org or "Vultr" in geo.get("as", ""):
        print("Detected Vultr cloud — consider low-latency region routing.")


# --- Main entry (local testing) ---
if __name__ == "__main__":
    try:
        start_ip_check(callback=ip_callback)
        listen_loop()
    finally:
        clear_session()
