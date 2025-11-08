import { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  isCallActive: boolean;
}

export default function Header({ onNavigate, isCallActive }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isCallActive) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-[#1C2E8A]/95 via-[#283CBB]/95 to-[#3448FF]/95 backdrop-blur-sm shadow-lg'
          : 'bg-gradient-to-r from-[#2431A0] via-[#2E3CCF] to-[#3B4DFF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <span className="text-white text-2xl font-bold tracking-wider">
            PROJECT
          </span>
          <span className="text-white text-2xl">✦</span>
          <span className="text-white text-2xl font-bold tracking-wider">
            RES-Q
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-12">
          <button
            onClick={() => onNavigate('home')}
            className="text-white text-lg font-medium hover:text-blue-200 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('updates')}
            className="text-white text-lg font-medium hover:text-blue-200 transition-colors"
          >
            Updates
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="text-white text-lg font-medium hover:text-blue-200 transition-colors"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
}
