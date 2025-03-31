
import React from "react";
import VoiceDemo from "./VoiceDemo";
import { TranscriptProvider } from "./contexts/TranscriptContext";
import { EventProvider } from "./contexts/EventContext";
import { SessionStatus } from "./types";

interface CopilotDemoAppProps {
  initialSessionStatus?: SessionStatus;
  onSessionStatusChange?: React.Dispatch<React.SetStateAction<SessionStatus>>;
  peerConnection?: RTCPeerConnection | null;
  dataChannel?: RTCDataChannel | null;
  isTranscriptionEnabled?: boolean;
  isAudioEnabled?: boolean;
  instructions?: string;
  tools?: any[];
}

export const CopilotDemoApp: React.FC<CopilotDemoAppProps> = (props) => {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <EventProvider>
        <TranscriptProvider>
          <VoiceDemo {...props} />
        </TranscriptProvider>
      </EventProvider>
    </div>
  );
};

export default CopilotDemoApp;
