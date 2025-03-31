
import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import VoiceDemo from './VoiceDemo';
import AtelierChat from './AtelierChat';
import { Button } from '../ui/button';

const VoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('text');

  // This effect is triggered when the widget is closed
  // to ensure proper cleanup
  useEffect(() => {
    if (!isOpen) {
      // Reset chat state when closing the widget
      setActiveMode('text');
    }
  }, [isOpen]);

  const handleSwitchMode = () => {
    setActiveMode(activeMode === 'voice' ? 'text' : 'voice');
  };

  return (
    <>
      {/* Chat Widget Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
        aria-label="Toggle voice assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Voice Widget Container */}
      {isOpen && (
        <>
          {activeMode === 'voice' ? (
            <VoiceDemo onSwitchToText={handleSwitchMode} />
          ) : (
            <AtelierChat onSwitchToVoice={handleSwitchMode} />
          )}
        </>
      )}
    </>
  );
};

export default VoiceWidget;
