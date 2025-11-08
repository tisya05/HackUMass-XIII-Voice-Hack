import { useState, useEffect } from 'react';
import SoundWave from './SoundWave';

interface CallInterfaceProps {
  onEndCall: () => void;
}

export default function CallInterface({ onEndCall }: CallInterfaceProps) {
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [response, setResponse] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    const simulateAIResponse = () => {
      setTimeout(() => {
        setIsAISpeaking(true);
        setResponse(
          'Hello, I am RES-Q. I am here to help you in this emergency situation. Please stay calm and tell me what kind of assistance you need.'
        );

        setTimeout(() => {
          setLocations([
            'Community Center - 123 Main St',
            'City Hall Emergency Shelter - 456 Oak Ave',
          ]);
        }, 2000);

        setTimeout(() => {
          setIsAISpeaking(false);
          setSummary(
            'User requested immediate help for an emergency situation. RES-Q advised staying calm and provided nearby safe shelters.'
          );
          setKeywords(['emergency', 'calm', 'shelter', 'help', 'assistance']);
        }, 3000);
      }, 1000);
    };

    simulateAIResponse();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start pt-20 pb-32 px-6">
        {/* SoundWave */}
        <SoundWave isActive={isAISpeaking} />

        <div className="w-full max-w-4xl mt-16 space-y-8">
          {/* Response */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-500 rounded-3xl p-8">
            <h2 className="text-white text-2xl font-bold mb-4">Response:</h2>
            <div className="text-gray-200 text-lg leading-relaxed min-h-[120px]">
              {response}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-2 border-gray-600 rounded-3xl p-8">
            <h2 className="text-white text-2xl font-bold mb-4">Locations:</h2>
            <div className="text-gray-200 text-lg space-y-3 min-h-[80px]">
              {locations.length > 0 ? (
                <ul className="space-y-2">
                  {locations.map((location, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No locations mentioned yet...</p>
              )}
            </div>
          </div>

          {/* Summary & Keywords */}
          <div className="bg-gradient-to-br from-blue-950/40 to-blue-900/40 border-2 border-blue-600 rounded-3xl p-8">
            <h2 className="text-white text-2xl font-bold mb-4">
              Summary & Keywords:
            </h2>

            {summary ? (
              <div className="space-y-4">
                <p className="text-gray-200 text-lg leading-relaxed">{summary}</p>

                <div className="flex flex-wrap gap-3 mt-4">
                  {keywords.map((word, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-600/30 text-blue-300 text-sm font-medium rounded-full border border-blue-500"
                    >
                      #{word}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-lg">
                Generating summary of the conversation...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* End Call Button - fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent pb-8">
        <button
          onClick={onEndCall}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
        >
          End Call
        </button>
      </div>
    </div>
  );
}
