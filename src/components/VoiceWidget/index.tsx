
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import VoiceDemo from './VoiceDemo';
import { Button } from '../ui/button';

const VoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);

  return (
    <>
      {/* Chat Widget Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setShowChatView(false); // Reset to welcome view when opening
          }
        }}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
        aria-label="Toggle voice assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Voice Widget Container */}
      {isOpen && (
        <>
          {showChatView ? (
            <VoiceDemo />
          ) : (
            <div className="fixed bottom-24 right-6 z-40 w-[400px] bg-white rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100">
              <div className="p-6 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-8">Atelier Assistant</h2>
                <img 
                  src="/lovable-uploads/0903a071-cd2b-4ee2-81ec-f06e597be691.png" 
                  alt="Atelier Assistant" 
                  className="w-32 h-32 mb-8 rounded-full object-cover"
                />
                <Button 
                  onClick={() => setShowChatView(true)} 
                  className="w-full bg-[#5856d6] hover:bg-[#4745ac] text-white text-base py-6 rounded-full"
                >
                  Chat to AI
                </Button>
                <div className="w-full mt-8 pt-4 border-t">
                  <div 
                    className="bg-gray-100 rounded-full p-4 text-center text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setShowChatView(true)}
                  >
                    Talk to Atelier here
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VoiceWidget;
