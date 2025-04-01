
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
      console.log("WebRTC connection closed successfully");
    } catch (err) {
      console.error("Error during connection cleanup:", err);
    }
  }
}

export async function createRealtimeConnection(
  EPHEMERAL_KEY: string,
  audioElement: RefObject<HTMLAudioElement | null>,
  isAudioEnabled: boolean = false,
  skipAudioStream: boolean = false // New parameter to skip audio stream creation
): Promise<{ pc: RTCPeerConnection; dc: RTCDataChannel }> {
  // Only check microphone support if we're not skipping audio stream
  if (!skipAudioStream) {
    await checkMicrophoneSupport();
  }
  
  console.log("Starting WebRTC connection setup");
  
  // Log user profile at session start
  try {
    const userProfileStorage = localStorage.getItem("user-profile");
    if (userProfileStorage) {
      const userProfile = JSON.parse(userProfileStorage);
      console.log("WebRTC Session Start - User Profile:", JSON.stringify(userProfile, null, 2));
    } else {
      console.log("WebRTC Session Start - No User Profile Found");
    }
  } catch (error) {
    console.error("Error loading user profile during WebRTC session start:", error);
  }
  
  // Add more diagnostics about the ephemeral key (without showing the key)
  console.log(`Ephemeral key provided: ${EPHEMERAL_KEY ? "Yes" : "No"}`);
  if (EPHEMERAL_KEY) {
    console.log(`Ephemeral key length: ${EPHEMERAL_KEY.length}`);
  } else {
    throw new Error("No ephemeral key provided for WebRTC connection");
  }
  
  // Create RTCPeerConnection with more diagnostic events
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
  
  // Handle ICE gathering state changes
  pc.onicegatheringstatechange = () => {
    console.log(`ICE gathering state: ${pc.iceGatheringState}`);
  };
  
  // Log when ICE candidates are created
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate generated");
    }
  };

  // Handle ICE candidate errors
  pc.onicecandidateerror = (event) => {
    console.warn("ICE candidate error:", event);
  };

  pc.ontrack = (e) => {
    if (audioElement.current) {
      console.log("Track received from remote peer");
      audioElement.current.srcObject = e.streams[0];
      // Make sure audio is muted unless the user has explicitly enabled it
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
    // Always request microphone access, even for text-only mode
    // This is needed because OpenAI's realtime API requires an audio track
    console.log("Requesting microphone access");
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

    console.log("Microphone access granted");
    
    // Add all audio tracks from the stream
    stream.getAudioTracks().forEach(track => {
      // If skipAudioStream is true, mute the track but still add it
      if (skipAudioStream) {
        track.enabled = false;
      }
      pc.addTrack(track, stream!);
    });
    
    console.log(`Added ${stream.getAudioTracks().length} audio tracks to the connection`);
    
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
  console.log("Creating data channel");
  const dc = pc.createDataChannel("oai-events", {
    ordered: true
  });

  // Log data channel state changes
  dc.onopen = () => console.log("Data channel opened");
  dc.onclose = () => console.log("Data channel closed");
  dc.onerror = (e) => console.error("Data channel error:", e);

  try {
    console.log("Creating connection offer");
    const offer = await pc.createOffer();
    console.log("Setting local description");
    await pc.setLocalDescription(offer);
    
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview-2024-12-17";
    
    console.log(`Connecting to OpenAI Realtime API with model: ${model}`);
    console.log(`Target URL: ${baseUrl}?model=${model}`);

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
      
      // Log the error details for debugging
      const errorText = await sdpResponse.text();
      console.error("SDP Response Error:", sdpResponse.status, errorText);
      
      throw new Error(`Failed to establish connection: ${sdpResponse.status} ${sdpResponse.statusText}`);
    }

    console.log("Received SDP response from server");
    const answerSdp = await sdpResponse.text();
    const answer: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: answerSdp,
    };

    console.log("Setting remote description");
    await pc.setRemoteDescription(answer);
    console.log("Remote description set successfully");
  } catch (err) {
    // Clean up resources on error
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    cleanupConnection(pc);
    console.error("WebRTC connection error:", err);
    throw new Error("Failed to establish connection. Please check your internet connection and try again.");
  }

  return { pc, dc };
}
