
/**
 * TextChatConnection.ts
 * 
 * This file implements WebRTC connection functionality for text-only chat,
 * without creating or adding microphone audio streams/tracks.
 */

// Connection state management
let peerConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;

// Configuration for STUN servers to help with NAT traversal
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

/**
 * Initializes a new WebRTC peer connection for text-only chat
 */
export const initializeConnection = (): RTCPeerConnection => {
  // Close any existing connection
  if (peerConnection) {
    peerConnection.close();
  }
  
  // Create a new RTCPeerConnection
  peerConnection = new RTCPeerConnection(rtcConfig);
  
  // Set up event listeners for connection state changes
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
      // Here you would typically send this candidate to the remote peer via your signaling server
    }
  };
  
  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection?.iceConnectionState);
  };
  
  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state:", peerConnection?.connectionState);
  };
  
  // Create a data channel for text communication
  dataChannel = peerConnection.createDataChannel("textChat");
  setupDataChannel(dataChannel);
  
  return peerConnection;
};

/**
 * Sets up event handlers for the data channel
 */
const setupDataChannel = (channel: RTCDataChannel) => {
  channel.onopen = () => {
    console.log("Data channel opened");
  };
  
  channel.onclose = () => {
    console.log("Data channel closed");
  };
  
  channel.onmessage = (event) => {
    console.log("Message received:", event.data);
    // Here you would handle incoming messages
  };
  
  channel.onerror = (error) => {
    console.error("Data channel error:", error);
  };
};

/**
 * Creates an offer to initiate the connection
 */
export const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
  if (!peerConnection) {
    throw new Error("Peer connection not initialized");
  }
  
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

/**
 * Handles an incoming answer from the remote peer
 */
export const handleAnswer = async (answer: RTCSessionDescriptionInit): Promise<void> => {
  if (!peerConnection) {
    throw new Error("Peer connection not initialized");
  }
  
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

/**
 * Handles an incoming offer from the remote peer and creates an answer
 */
export const handleOffer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
  if (!peerConnection) {
    initializeConnection();
  }
  
  if (!peerConnection) {
    throw new Error("Failed to initialize peer connection");
  }
  
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  
  // Set up data channel for answering side
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    setupDataChannel(dataChannel);
  };
  
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

/**
 * Adds an ICE candidate from the remote peer
 */
export const addIceCandidate = async (candidate: RTCIceCandidate): Promise<void> => {
  if (!peerConnection) {
    throw new Error("Peer connection not initialized");
  }
  
  await peerConnection.addIceCandidate(candidate);
};

/**
 * Sends a text message through the data channel
 */
export const sendMessage = (message: string): void => {
  if (!dataChannel || dataChannel.readyState !== 'open') {
    console.error("Data channel not open");
    return;
  }
  
  dataChannel.send(message);
};

/**
 * Closes the connection and cleans up resources
 */
export const closeConnection = (): void => {
  if (dataChannel) {
    dataChannel.close();
    dataChannel = null;
  }
  
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
};

/**
 * Sets an event handler for incoming messages
 */
export const onMessageReceived = (callback: (message: string) => void): void => {
  if (!dataChannel) {
    console.error("Data channel not initialized");
    return;
  }
  
  dataChannel.onmessage = (event) => {
    callback(event.data);
  };
};
