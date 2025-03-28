
import { useState, memo } from 'react';
import { Mic, X } from 'lucide-react';
import VoiceDemo from './VoiceDemo';

const VoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Voice Widget Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
        aria-label="Toggle voice assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Voice Widget Container - Only mount when needed */}
      {isOpen && <VoiceDemo />}
    </>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(VoiceWidget);
