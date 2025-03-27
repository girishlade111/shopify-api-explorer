
import { RefObject } from "react";

async function checkMicrophoneSupport() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Your browser doesn't support microphone access. Please use a modern browser like Chrome, Firefox, or Safari.");
  }
}

// Add a cleanup function to properly close connections
export function cleanupConnection(pc: RTCPeerConnection | null): void {
  if (pc) {
    try {
      // Close all transceivers
      pc.getTransceivers().forEach(transceiver => {
        if (transceiver.sender.track) {
          transceiver.sender.track.stop();
        }
      });
      
      // Close all senders
      pc.getSenders().forEach(sender => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      
      // Close the peer connection
      pc.close();
    } catch (err) {
      console.error("Error during connection cleanup:", err);
    }
  }
}

export async function createRealtimeConnection(
  EPHEMERAL_KEY: string,
  audioElement: RefObject<HTMLAudioElement | null>,
  isAudioEnabled: boolean = false
): Promise<{ pc: RTCPeerConnection; dc: RTCDataChannel }> {
  // First check if microphone is supported
  await checkMicrophoneSupport();
  
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  });

  // Track connection state for debugging
  pc.onconnectionstatechange = () => {
    console.log(`RTCPeerConnection state: ${pc.connectionState}`);
  };

  // Track ICE connection state for debugging
  pc.oniceconnectionstatechange = () => {
    console.log(`ICE connection state: ${pc.iceConnectionState}`);
  };

  // Handle ICE candidate errors
  pc.onicecandidateerror = (event) => {
    console.warn("ICE candidate error:", event);
  };

  pc.ontrack = (e) => {
    if (audioElement.current) {
      audioElement.current.srcObject = e.streams[0];
      audioElement.current.muted = !isAudioEnabled;
      
      if (isAudioEnabled) {
        audioElement.current.play().catch(err => {
          console.warn("Autoplay prevented:", err);
        });
      }
    }
  };

  let stream: MediaStream | null = null;
  try {
    // Request microphone access with specific constraints for better quality
    stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16
      }
    });

    // Add all audio tracks from the stream
    stream.getAudioTracks().forEach(track => {
      pc.addTrack(track, stream!);
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "NotAllowedError") {
        throw new Error("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        throw new Error("No microphone found. Please connect a microphone and try again.");
      } else if (err.name === "NotReadableError") {
        throw new Error("Your microphone is busy or not responding. Please check your microphone connection and try again.");
      }
    }
    throw new Error("Failed to access microphone. Please check your microphone settings and try again.");
  }

  // Create data channel with more reliable options
  const dc = pc.createDataChannel("oai-events", {
    ordered: true
  });

  // Log data channel state changes
  dc.onopen = () => console.log("Data channel opened");
  dc.onclose = () => console.log("Data channel closed");
  dc.onerror = (e) => console.error("Data channel error:", e);

  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview-2024-12-17";

    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    if (!sdpResponse.ok) {
      // Clean up the stream if response is not OK
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      throw new Error(`Failed to establish connection: ${sdpResponse.status} ${sdpResponse.statusText}`);
    }

    const answerSdp = await sdpResponse.text();
    const answer: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: answerSdp,
    };

    await pc.setRemoteDescription(answer);
  } catch (err) {
    // Clean up resources on error
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    cleanupConnection(pc);
    throw new Error("Failed to establish connection. Please check your internet connection and try again.");
  }

  return { pc, dc };
}
