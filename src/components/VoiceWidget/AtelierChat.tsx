
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Mic } from 'lucide-react';
import { useTranscript } from './contexts/TranscriptContext';
import { useEvent } from './contexts/EventContext';
import CopilotDemoApp from './CopilotDemoApp';

const AtelierChat = () => {
  const [sessionStatus, setSessionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const { resetTranscript } = useTranscript();
  const { resetEvents } = useEvent();

  // Connect automatically when component mounts
  useEffect(() => {
    startSession();
    
    // Clean up when the component unmounts
    return () => {
      stopSession();
    };
  }, []);

  async function startSession() {
    resetTranscript();
    resetEvents();
    setSessionStatus('CONNECTING');

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = pc;
      setPeerConnection(pc);

      const dc = pc.createDataChannel('data', { ordered: true });
      dataChannelRef.current = dc;
      setDataChannel(dc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const answer = await fetch('https://example.com/api/webrtc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer: pc.localDescription }),
      }).then(r => r.json());

      await pc.setRemoteDescription(
        new RTCSessionDescription(answer.answer)
      );

      pc.addEventListener('connectionstatechange', () => {
        console.log('RTCPeerConnection state:', pc.connectionState);
      });

      pc.addEventListener('iceconnectionstatechange', () => {
        console.log('ICE connection state:', pc.iceConnectionState);
      });

      // Add candidates from the response
      for (const candidate of answer.candidates || []) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }

      // Handle ICE candidates
      pc.addEventListener('icecandidate', async (event) => {
        if (event.candidate) {
          try {
            await fetch('https://example.com/api/webrtc/candidate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                candidate: event.candidate,
              }),
            });
          } catch (err) {
            console.error('Error sending ICE candidate:', err);
          }
        }
      });
    } catch (err) {
      console.error('Error setting up WebRTC connection:', err);
      setSessionStatus('DISCONNECTED');
    }
  }

  function stopSession() {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    dataChannelRef.current = null;
    peerConnectionRef.current = null;
    
    setDataChannel(null);
    setPeerConnection(null);
    setSessionStatus('DISCONNECTED');
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[320px] bg-white rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <button className="p-1">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold">Enzo AI</h2>
        <button className="p-1" onClick={stopSession}>
          <X size={24} />
        </button>
      </div>
      
      {/* Chat Interface */}
      <div className="h-[500px] flex flex-col">
        <CopilotDemoApp
          initialSessionStatus={sessionStatus}
          onSessionStatusChange={setSessionStatus}
          peerConnection={peerConnection}
          dataChannel={dataChannel}
          isTranscriptionEnabled={false}
          isAudioEnabled={true}
          instructions={""}
          tools={[]}
          isVoiceMode={false}
        />
      </div>
    </div>
  );
};

export default AtelierChat;
