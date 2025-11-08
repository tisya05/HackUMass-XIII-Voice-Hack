import { useEffect, useRef, useState } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`min-h-screen bg-black py-24 px-6 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {/* About RES-Q */}
          <div
            className="bg-gradient-to-br from-blue-900/60 to-blue-700/60 border-2 border-blue-500 rounded-3xl p-12
                       backdrop-blur-sm shadow-lg shadow-blue-900/30 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]
                       transition-all duration-500 transform hover:scale-[1.03]"
          >
            <h2 className="text-5xl font-bold mb-8">
              <span className="text-white">About </span>
              <span className="text-blue-600">RES-Q</span>
            </h2>

            <div className="text-white text-lg leading-relaxed space-y-6">
              <p>
                Emergencies don't wait for translation. Project RES-Q breaks language and accessibility barriers
                with a multilingual AI that understands emotion and urgency, not just words.
              </p>
              <p>
                Whether you whisper for help in Hindi, Spanish, or Swahili, RES-Q responds with local updates,
                verified resources, and calm instruction. It gives every voice a chance to be heard, and every life a
                chance to be saved.
              </p>
            </div>
          </div>

          {/* Privacy & Data */}
          <div
            className="bg-gradient-to-br from-blue-900/60 to-blue-700/60 border-2 border-blue-500 rounded-3xl p-12
                       backdrop-blur-sm shadow-lg shadow-blue-900/30 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]
                       transition-all duration-500 transform hover:scale-[1.03]"
          >
            <h3 className="text-5xl font-bold mb-8">
              <span className="text-white">Privacy & </span>
              <span className="text-blue-600">DATA</span>
            </h3>

            <div className="text-white text-lg leading-relaxed space-y-6">
              <p>
                RES-Q uses minimal data only to keep you safe. When you start a call, your approximate location is
                determined through your IP address, which helps us provide accurate, region-specific updates during
                emergencies.
              </p>
              <p>
                It does not reveal your exact location. Your voice is processed in real time to understand and respond,
                but never stored or recorded. Once the call ends, all conversation data is automatically deleted.
                Nothing you say is saved, shared, or used beyond that live session.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div>
          <h3 className="text-6xl font-bold mb-16 text-center">
            <span className="text-white">Our </span>
            <span className="text-blue-600">METRICS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-7xl font-bold text-blue-600 mb-4">74</div>
              <div className="text-white text-xl">languages supported</div>
            </div>

            <div className="text-center">
              <div className="text-7xl font-bold text-blue-600 mb-4">100+</div>
              <div className="text-white text-xl">emergencies resolved</div>
            </div>

            <div className="text-center">
              <div className="text-7xl font-bold text-blue-600 mb-4">32</div>
              <div className="text-white text-xl">data centers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
