# HackUMass-XIII-Voice-Hack

## To Do
* Add IP detection support
* Web scraping integration 
* Wesite (frontend + backend)

# 🎤 Gemini Voice Base Stack

A base voice interface stack combining **Google Gemini** and **ElevenLabs** for real-time conversational AI.

This stack lets you talk naturally with Gemini, using your microphone for input and ElevenLabs for smooth, natural voice replies — all handled locally through Python.

---

## ⚙️ Setup Guide

### 1. Create and activate the virtual environment

```bash
conda create -n hackumass python=3.10
conda activate hackumass
```

### 2. Install required libraries

```bash
conda install -c conda-forge pyaudio portaudio
pip install speechrecognition google-generativeai requests pydub simpleaudio
pip install playsound==1.3.0
pip install python-dotenv
pip install elevenlabs
pip install pyobjc
```

---

## 🔑 Environment Setup

Create a `.env` file in your project root and add your API keys:

```env
GEMINI_API_KEY=your_gemini_key_here
ELEVEN_API_KEY=your_elevenlabs_key_here
```

---

## 🚀 Run the Project

```bash
python base-stack.py
```

Once running:

* 🎙️ Speak into your microphone  
* ⏸️ The system automatically detects when you stop speaking  
* 🤖 Gemini generates a text response  
* 🔊 The reply is spoken aloud using ElevenLabs  
* 🔁 If you start speaking again, playback pauses automatically  

---

## 🧩 Current Features

| Feature | Status | Description |
|----------|---------|-------------|
| 🎧 Continuous Mic Listening | ✅ | Listens for speech without pressing a button |
| 🕒 Auto Pause Detection | ✅ | Detects silence to trigger Gemini |
| 🧠 Gemini Integration | ✅ | Uses Google Gemini for generating responses |
| 🔈 ElevenLabs TTS | ✅ | Converts Gemini output to natural speech |
| ⏹️ Interruptible Playback | ✅ | Automatically pauses when user starts talking |
| 🧹 Temp File Cleanup | ✅ | Removes temporary audio files after playback |

---

## 🧱 Project Structure

```
gemini-voice-base/
│
├── base-stack.py         # Main voice interaction script
├── .env                  # Environment variables (not committed)
├── requirements.txt      # Optional dependency file
└── README.md             # This documentation
```

---


