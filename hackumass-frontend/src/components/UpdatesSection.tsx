import { useEffect, useRef, useState } from 'react';

export default function UpdatesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // trigger only once
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="updates"
      ref={sectionRef}
      className={`min-h-screen bg-black py-20 px-6 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-6xl font-bold mb-6">
          <span className="text-white">Active </span>
          <span className="text-blue-600">Updates</span>
        </h2>

        <p className="text-white text-xl mb-12 max-w-2xl">
          Find all the information about recent happenings in your location in real time.
        </p>

        <div className="bg-gradient-to-br from-blue-900/60 to-blue-700/60 border-2 border-blue-500 rounded-3xl p-12 min-h-[500px] backdrop-blur-sm shadow-lg shadow-blue-900/30">
          <div className="text-gray-200 text-lg">
            <p className="mb-4">
              Loading real-time emergency updates for your location...
            </p>

            <div className="space-y-4 mt-8">
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <p className="font-semibold text-white">Weather Alert</p>
                <p className="text-gray-300">
                  Severe storm warning in effect until 8:00 PM
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <p className="font-semibold text-white">Emergency Services</p>
                <p className="text-gray-300">
                  All emergency shelters are open and accepting residents
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <p className="font-semibold text-white">Traffic Update</p>
                <p className="text-gray-300">
                  Highway 101 closed due to flooding — use alternate routes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
