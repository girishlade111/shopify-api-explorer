
import { useState, useEffect } from 'react';
import { Menu, Mic, MessageSquare, X } from 'lucide-react';
import VoiceDemo from './VoiceDemo';
import AtelierChat from './AtelierChat';
import { TranscriptProvider } from './contexts/TranscriptContext';
import { EventProvider } from './contexts/EventContext';

const VoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const [activeChatType, setActiveChatType] = useState<'ai' | 'atelier' | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);

  // This effect is triggered when the widget is closed
  // to ensure proper cleanup
  useEffect(() => {
    if (!isOpen) {
      // Reset chat state when closing the widget
      setShowChatView(false);
      setActiveChatType(null);
      setIsMinimized(false);
      setShowModeSelection(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Widget Toggle Button */}
      {!isOpen && !isMinimized && (
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setShowModeSelection(true); // Show mode selection when opening
              setShowChatView(false);
              setActiveChatType(null);
            }
          }}
          className="fixed bottom-6 left-6 z-50 bg-white text-black py-3 px-4 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-3"
          aria-label="Toggle voice assistant"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-12 h-12 rounded-full bg-[#33C3F0] flex items-center justify-center">
            {/* Empty blue circle without an icon */}
          </div>
          <span className="text-lg font-medium">Click here to chat with AI!</span>
          {isHovering && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="absolute top-1 left-1 bg-gray-200 rounded-full p-1 opacity-80 hover:opacity-100"
              aria-label="Minimize chat widget"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </button>
      )}

      {/* Minimized Chat Widget Button */}
      {!isOpen && isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
          }}
          className="fixed bottom-6 left-6 z-50 bg-white text-black py-3 px-4 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-3"
          aria-label="Expand chat widget"
        >
          <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex items-center justify-center">
            {/* Empty blue circle without an icon */}
          </div>
          <span className="text-lg font-medium">Enzo AI</span>
        </button>
      )}

      {/* Voice Widget Container */}
      {isOpen && (
        <TranscriptProvider>
          <EventProvider>
            {showModeSelection ? (
              <div className="fixed bottom-0 left-0 z-40 w-full md:w-[400px] h-[320px] bg-white rounded-t-xl md:rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Mode Selection Content - Simplified without header */}
                <div className="flex-1 py-2 px-4 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold mb-3">Choose your mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                    <button
                      onClick={() => {
                        setShowModeSelection(false);
                        setShowChatView(true);
                        setActiveChatType('atelier');
                      }}
                      className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#33C3F0] transition-all duration-200"
                    >
                      <MessageSquare size={32} className="text-[#33C3F0] mb-2" />
                      <span className="text-base font-semibold">Text Chat</span>
                      <p className="text-gray-500 text-center text-sm">Chat by typing messages</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowModeSelection(false);
                        setShowChatView(true);
                        setActiveChatType('ai');
                      }}
                      className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#33C3F0] transition-all duration-200"
                    >
                      <Mic size={32} className="text-[#33C3F0] mb-2" />
                      <span className="text-base font-semibold">Voice Chat</span>
                      <p className="text-gray-500 text-center text-sm">Chat by speaking out loud</p>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              showChatView ? (
                activeChatType === 'ai' ? <VoiceDemo /> : <AtelierChat />
              ) : (
                <div className="fixed bottom-0 left-0 z-40 w-full md:w-[400px] h-[600px] bg-white rounded-t-xl md:rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <button className="p-2">
                      <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <h2 className="text-xl font-semibold">Enzo AI</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2">
                      <X className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Chat content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex-shrink-0 mr-3"></div>
                      <div className="bg-gray-100 rounded-lg p-4 max-w-[75%]">
                        <p>Hello! I am Enzo, your AI Agent to help you shop.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input area */}
                  <div className="p-4 border-t">
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <input
                        type="text"
                        placeholder="Type your message here..."
                        className="w-full bg-transparent px-4 py-3 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShowChatView(true);
                            setActiveChatType('atelier');
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          setShowChatView(true);
                          setActiveChatType('ai');
                        }}
                        className="bg-[#33C3F0] rounded-full p-3 mx-2"
                      >
                        <Mic className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </EventProvider>
        </TranscriptProvider>
      )}
    </>
  );
};

export default VoiceWidget;
