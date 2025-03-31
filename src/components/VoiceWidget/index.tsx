
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';
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
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Voice Widget Container */}
      {isOpen && (
        <EventProvider>
          <TranscriptProvider>
            <VoiceDemo />
          </TranscriptProvider>
        </EventProvider>
      )}
    </>
  );
};

export default VoiceWidget;
