
import { useState, useEffect } from 'react';
import { Mic, MessageSquare } from 'lucide-react';
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
        className={isOpen 
          ? "fixed bottom-6 left-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200"
          : "fixed bottom-6 left-6 z-50 bg-white text-black px-6 py-4 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 min-w-[280px]"}
        aria-label="Toggle voice assistant"
      >
        {isOpen ? (
          <span className="w-6 h-6">×</span>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex-shrink-0"></div>
            <span className="font-medium">Click here to chat with AI!</span>
          </>
        )}
      </button>

      {/* Voice Widget Container */}
      {isOpen && (
        <TranscriptProvider>
          <EventProvider>
            {showChatView ? (
              activeChatType === 'ai' ? <VoiceDemo /> : <AtelierChat />
            ) : (
              <div className="fixed bottom-24 left-6 z-40 w-[320px] bg-white rounded-[20px] shadow-lg transition-all duration-300">
                <div className="p-5">
                  <h2 className="text-center text-xl font-medium mb-5 text-gray-800">How do you want to chat today?</h2>
                  
                  <div className="flex gap-4">
                    {/* Voice Chat Option */}
                    <button 
                      onClick={() => {
                        setShowChatView(true);
                        setActiveChatType('ai');
                      }}
                      className="flex-1 flex flex-col items-center justify-center bg-[#87CEEB] text-white p-6 rounded-lg hover:bg-[#6BBBDF] transition-colors"
                      aria-label="Voice chat"
                    >
                      <Mic className="w-8 h-8 mb-2" />
                      <span className="text-lg">Voice</span>
                    </button>
                    
                    {/* Text Chat Option */}
                    <button
                      onClick={() => {
                        setShowChatView(true);
                        setActiveChatType('atelier');
                      }}
                      className="flex-1 flex flex-col items-center justify-center bg-[#87CEEB] text-white p-6 rounded-lg hover:bg-[#6BBBDF] transition-colors"
                      aria-label="Text chat"
                    >
                      <MessageSquare className="w-8 h-8 mb-2" />
                      <span className="text-lg">Text</span>
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
