
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

  useEffect(() => {
    if (!isOpen) {
      setShowChatView(false);
      setActiveChatType(null);
      setIsMinimized(false);
      setShowModeSelection(false);
    }
  }, [isOpen]);

  const handleCloseWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const VoiceBar = () => (
    <button
      onClick={() => {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setShowModeSelection(true);
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
  );

  const MinimizedBar = () => (
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
  );

  return (
    <>
      {!isOpen && !isMinimized && <VoiceBar />}
      {!isOpen && isMinimized && <MinimizedBar />}

      {isOpen && (
        <TranscriptProvider>
          <EventProvider>
            {showModeSelection ? (
              <div className="fixed bottom-6 left-6 z-40 w-[350px] h-[180px] bg-white rounded-[24px] shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                <div className="flex-1 py-6 px-6 flex flex-col items-start justify-center">
                  <h3 className="text-[#333] text-xl font-medium mb-5 ml-1">How do you want to chat today?</h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => {
                        setShowModeSelection(false);
                        setShowChatView(true);
                        setActiveChatType('ai');
                      }}
                      className="flex flex-col items-center justify-center p-4 bg-[#8DD6F0] rounded-lg hover:bg-[#6BC7E8] transition-all duration-200"
                    >
                      <Mic size={24} className="text-white mb-1" />
                      <span className="text-white font-medium">Voice</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowModeSelection(false);
                        setShowChatView(true);
                        setActiveChatType('atelier');
                      }}
                      className="flex flex-col items-center justify-center p-4 bg-[#8DD6F0] rounded-lg hover:bg-[#6BC7E8] transition-all duration-200"
                    >
                      <MessageSquare size={24} className="text-white mb-1" />
                      <span className="text-white font-medium">Text</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              showChatView ? (
                activeChatType === 'ai' ? <VoiceDemo onClose={handleCloseWidget} /> : <AtelierChat onClose={handleCloseWidget} />
              ) : (
                <div className="fixed bottom-6 left-6 z-40 w-[400px] h-[600px] bg-white rounded-[24px] shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4">
                    <button className="p-2">
                      <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <h2 className="text-xl font-semibold">Enzo AI</h2>
                    <button onClick={handleCloseWidget} className="p-2">
                      <X className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#33C3F0] flex-shrink-0 mr-3"></div>
                      <div className="bg-gray-100 rounded-lg p-4 max-w-[75%]">
                        <p>Hello! I am Enzo, your AI Agent to help you shop.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
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
