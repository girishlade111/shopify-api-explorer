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
  skipAudioStream: boolean = false // Parameter to skip audio stream creation
): Promise<{ pc: RTCPeerConnection; dc: RTCDataChannel }> {
  console.log("Starting WebRTC connection setup with detailed logging...");
  
  // Only check microphone support if we're not skipping audio stream
  if (!skipAudioStream) {
    await checkMicrophoneSupport();
  }
  
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
  
  // Enhanced ICE server configuration with additional STUN servers for better connectivity
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" }
  ];
  
  console.log(`Configuring ICE servers: ${iceServers.length} servers`);
  
  // Create RTCPeerConnection with more diagnostic events
  const pc = new RTCPeerConnection({
    iceServers: iceServers,
    iceCandidatePoolSize: 10 // Increase candidate pool for better connection chances
  });

  // Track connection state for debugging
  pc.onconnectionstatechange = () => {
    console.log(`RTCPeerConnection state: ${pc.connectionState}`);
  };

  // Track ICE connection state for debugging
  pc.oniceconnectionstatechange = () => {
    console.log(`ICE connection state: ${pc.iceConnectionState}`);
    
    // Add extra debugging for failed connection states
    if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
      console.warn("ICE connection failed or disconnected. Details:", {
        iceGatheringState: pc.iceGatheringState,
        signalingState: pc.signalingState,
        connectionState: pc.connectionState
      });
    }
  };
  
  // Handle ICE gathering state changes
  pc.onicegatheringstatechange = () => {
    console.log(`ICE gathering state: ${pc.iceGatheringState}`);
  };
  
  // Log when ICE candidates are created
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate generated:", event.candidate.candidate.split(" ")[0]);
    }
  };

  // Handle ICE candidate errors with more details
  pc.onicecandidateerror = (event) => {
    console.warn("ICE candidate error:", {
      errorCode: event.errorCode,
      errorText: event.errorText,
      hostCandidate: event.hostCandidate,
      url: event.url
    });
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
    
    // Add timeout to catch stalling getUserMedia requests
    const streamPromise = navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16
      }
    });
    
    const timeoutPromise = new Promise<MediaStream>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Microphone access request timed out after 10 seconds"));
      }, 10000);
    });
    
    // Race the stream request against a timeout
    stream = await Promise.race([streamPromise, timeoutPromise]);

    console.log("Microphone access granted");
    
    // Add all audio tracks from the stream
    stream.getAudioTracks().forEach(track => {
      // If skipAudioStream is true, mute the track but still add it
      if (skipAudioStream) {
        track.enabled = false;
        console.log("Audio track disabled for text-only mode");
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
      } else if (err.name === "TimeoutError" || err.message.includes("timed out")) {
        throw new Error("Microphone access request timed out. Please try again or check your browser settings.");
      }
    }
    throw new Error("Failed to access microphone. Please check your microphone settings and try again.");
  }

  // Create data channel with more reliable options
  console.log("Creating data channel");
  const dc = pc.createDataChannel("oai-events", {
    ordered: true,
    maxRetransmits: 3 // Allow retries for improved reliability
  });

  // Log data channel state changes
  dc.onopen = () => console.log("Data channel opened");
  dc.onclose = () => console.log("Data channel closed");
  dc.onerror = (e) => console.error("Data channel error:", e);
  
  // Add heartbeat mechanism to keep connection alive
  let heartbeatInterval: number | null = null;
  dc.onopen = () => {
    console.log("Data channel opened");
    
    // Set up heartbeat to keep connection alive
    heartbeatInterval = window.setInterval(() => {
      try {
        if (dc.readyState === "open") {
          dc.send(JSON.stringify({ type: "heartbeat", timestamp: Date.now() }));
        }
      } catch (e) {
        console.warn("Error sending heartbeat:", e);
      }
    }, 30000); // Send heartbeat every 30 seconds
  };
  
  dc.onclose = () => {
    console.log("Data channel closed");
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  try {
    console.log("Creating connection offer");
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false
    });
    console.log("Setting local description");
    await pc.setLocalDescription(offer);
    
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview-2024-12-17";
    
    console.log(`Connecting to OpenAI Realtime API with model: ${model}`);
    console.log(`Target URL: ${baseUrl}?model=${model}`);
    
    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

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
    
    // Wait for ICE gathering to complete or timeout
    if (pc.iceGatheringState !== 'complete') {
      await new Promise<void>((resolve) => {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            resolve();
          }
        };
        
        // Check immediately
        checkState();
        
        // Also set up an event listener
        pc.addEventListener('icegatheringstatechange', checkState);
        
        // Set a timeout just in case
        setTimeout(() => {
          pc.removeEventListener('icegatheringstatechange', checkState);
          resolve(); // Resolve anyway after timeout to not block forever
        }, 5000);
      });
    }
    
    console.log("ICE gathering completed or timed out, connection should be established");
    
  } catch (err) {
    // Clean up resources on error
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    cleanupConnection(pc);
    
    // Provide more detailed error information
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error("WebRTC connection timed out:", err);
      throw new Error("Connection request timed out. Please check your internet connection and try again.");
    } else {
      console.error("WebRTC connection error:", err);
      throw new Error("Failed to establish connection. Please check your internet connection and try again.");
    }
  }

  return { pc, dc };
}
