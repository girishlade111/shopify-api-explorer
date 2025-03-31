
import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import Transcript from './Transcript';

interface VoiceModeProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  onToggleMic?: () => void;
  onToggleSpeaker?: () => void;
  isMicMuted: boolean;
  isSpeakerMuted: boolean;
  onChangeMode: () => void;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
}

const VoiceMode: React.FC<VoiceModeProps> = ({ 
  isConnected, 
  onToggleConnection, 
  onToggleMic, 
  onToggleSpeaker, 
  isMicMuted, 
  isSpeakerMuted,
  onChangeMode,
  messages
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Atelier Assistant</h2>
        <div className="flex gap-2">
          <button 
            onClick={onToggleMic}
            className="p-3 rounded-full transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
            aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={onToggleSpeaker}
            className="p-3 rounded-full transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
            aria-label={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
          >
            {isSpeakerMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onToggleConnection} 
          className={`w-full py-3 rounded-full text-white font-medium text-lg ${
            isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-[#5856d6] hover:bg-[#4745ac]'
          } transition-colors`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Transcript messages={messages} />
      </div>
      
      <div className="p-4 border-t">
        <button 
          onClick={onChangeMode}
          className="w-full mt-4 py-3 px-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <span className="text-gray-700">Switch to Text Mode</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceMode;
