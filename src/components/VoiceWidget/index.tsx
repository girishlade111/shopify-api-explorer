
import { useState, useEffect } from 'react';
import { MessageCircle, X, Mic, MessageSquare } from 'lucide-react';
import VoiceDemo from './VoiceDemo';
import AtelierChat from './AtelierChat';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';

const VoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const [activeChatType, setActiveChatType] = useState<'ai' | 'atelier' | null>(null);

  // This effect is triggered when the widget is closed
  // to ensure proper cleanup
  useEffect(() => {
    if (!isOpen) {
      // Reset chat state when closing the widget
      setShowChatView(false);
      setActiveChatType(null);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Widget Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setShowChatView(false); // Reset to welcome view when opening
            setActiveChatType(null);
          }
        }}
        className="fixed bottom-6 left-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
        aria-label="Toggle voice assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Voice Widget Container */}
      {isOpen && (
        <TranscriptProvider>
          <EventProvider>
            {showChatView ? (
              activeChatType === 'ai' ? <VoiceDemo /> : <AtelierChat />
            ) : (
              <div className="fixed bottom-24 left-6 z-40 w-[320px] bg-white rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100">
                <div className="p-4">
                  <h2 className="text-center text-lg font-medium mb-4">How do you want to chat today?</h2>
                  
                  <div className="flex gap-4">
                    {/* Voice Chat Option */}
                    <button 
                      onClick={() => {
                        setShowChatView(true);
                        setActiveChatType('ai');
                      }}
                      className="flex-1 flex flex-col items-center justify-center bg-[#87CEEB] text-white p-4 rounded-lg hover:bg-[#6BBBDF] transition-colors"
                      aria-label="Voice chat"
                    >
                      <Mic className="w-7 h-7 mb-2" />
                      <span>Voice</span>
                    </button>
                    
                    {/* Text Chat Option */}
                    <button
                      onClick={() => {
                        setShowChatView(true);
                        setActiveChatType('atelier');
                      }}
                      className="flex-1 flex flex-col items-center justify-center bg-[#87CEEB] text-white p-4 rounded-lg hover:bg-[#6BBBDF] transition-colors"
                      aria-label="Text chat"
                    >
                      <MessageSquare className="w-7 h-7 mb-2" />
                      <span>Text</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </EventProvider>
        </TranscriptProvider>
      )}
    </>
  );
};

export default VoiceWidget;
