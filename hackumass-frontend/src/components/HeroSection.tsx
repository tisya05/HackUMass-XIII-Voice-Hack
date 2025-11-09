import { Phone } from 'lucide-react';
import { useState } from 'react';

interface HeroSectionProps {
  onCallClick?: () => void;
}

export default function HeroSection({ onCallClick }: HeroSectionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleUserVoice() {
    // browser speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎙 Listening...');
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🛑 Stopped listening');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('🗣 You said:', transcript);
      setIsProcessing(true);

      try {
        const response = await fetch('http://localhost:5000/process_text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript }),
        });

        if (!response.ok) throw new Error('Backend request failed');
        const data = await response.json();
        console.log('✅ AI Response:', data);

        // Play returned audio
        if (data['audio url']) {
          const audio = new Audio(`http://localhost:5000${data['audio url']}`);
          audio.play();
        } else {
          alert(`AI Response: ${data['response text']}`);
        }
      } catch (err) {
        console.error('❌ Error connecting to backend:', err);
        alert('Connection failed. Ensure Flask backend is running.');
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
  }

  return (
    <section
      id="home"
      className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Left Image (AI Head Graphic) */}
      <img
        src="/assets/ai.jpg"
        alt="AI Illustration"
        className="absolute left-8 bottom-10 w-72 md:w-[24rem] opacity-90 select-none"
      />

      {/* Right Image (Megaphone Graphic) */}
      <img
        src="/assets/megaphone.jpg"
        alt="Megaphone Illustration"
        className="absolute right-[-1rem] bottom-6 w-56 md:w-72 opacity-90 select-none"
      />

      {/* Center Content */}
      <div className="text-center z-10 px-6">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="text-white block">Get Immediate</span>
          <span className="text-blue-600 block">ASSISTANCE</span>
        </h1>

        <button
          onClick={handleUserVoice}
          disabled={isListening || isProcessing}
          className={`group relative mt-12 mx-auto flex items-center justify-between gap-6
                     px-12 py-5 rounded-full text-xl font-semibold tracking-wide
                     text-white border border-[#6C4BFF] 
                     bg-[radial-gradient(circle_at_left,_#1E003C,_#4C3CF3_70%,_#221047_100%)]
                     transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6C4BFF]/50
                     ${isListening || isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className="ml-2">
            {isListening
              ? 'Listening...'
              : isProcessing
              ? 'Processing...'
              : 'TALK TO RES-Q'}
          </span>
          <div
            className="flex items-center justify-center bg-black rounded-full w-10 h-10 
                        group-hover:bg-[#1A003C] transition-colors duration-300"
          >
            <Phone className="w-5 h-5 text-white" />
          </div>
        </button>

        <p className="text-white text-xl mt-8 tracking-wide">
          POWERED BY AI. GET REAL-TIME HELP IN ANY LANGUAGE.
        </p>
      </div>
    </section>
  );
}
