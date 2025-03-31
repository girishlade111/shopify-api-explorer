
import React from "react";
import { VoiceDemo } from "./VoiceDemo";
import { TranscriptProvider } from "./contexts/TranscriptContext";
import { EventProvider } from "./contexts/EventContext";

export const CopilotDemoApp: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <EventProvider>
        <TranscriptProvider>
          <VoiceDemo />
        </TranscriptProvider>
      </EventProvider>
    </div>
  );
};

export default CopilotDemoApp;
