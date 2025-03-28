
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// UI components
import Transcript from "./components/Transcript";

// Types
import { SessionStatus } from "./types";

// Context providers & hooks
import { useTranscript } from "./contexts/TranscriptContext";
import { useEvent } from "./contexts/EventContext";
import { useHandleServerEvent } from "./hooks/useHandleServerEvent";

interface AppProps {
  initialSessionStatus: SessionStatus;
  onSessionStatusChange: (status: SessionStatus) => void;
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isTranscriptionEnabled: boolean;
  isAudioEnabled: boolean;
  instructions: string;
  tools: any[];
}

function CopilotDemoApp(props: AppProps) {
  const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript();
  const { logClientEvent } = useEvent();

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(props.initialSessionStatus);

  const [userText, setUserText] = useState<string>("");
  const [isPTTActive, setIsPTTActive] = useState<boolean>(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState<boolean>(false);

  const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
    if (props.dataChannel && props.dataChannel.readyState === "open") {
      logClientEvent(eventObj, eventNameSuffix);
      props.dataChannel.send(JSON.stringify(eventObj));
    } else {
      logClientEvent(
        { attemptedEvent: eventObj.type },
        "error.data_channel_not_open"
      );
      console.error(
        "Failed to send message - no data channel available",
        eventObj
      );
    }
  };

  const handleServerEventRef = useHandleServerEvent({
    setSessionStatus,
    sendClientEvent,
  });

  useEffect(() => {
    if (!props.dataChannel) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        handleServerEventRef.current(data);
      } catch (error) {
        console.error("Error handling message:", error);
      }
    };

    const handleOpen = () => {
      console.log("Data channel opened");
      setSessionStatus("CONNECTED");
    };

    const handleClose = () => {
      console.log("Data channel closed");
      setSessionStatus("DISCONNECTED");
    };

    const handleError = (error: Event) => {
      console.error("Data channel error:", error);
      setSessionStatus("DISCONNECTED");
    };

    if (props.dataChannel) {
      props.dataChannel.addEventListener("message", handleMessage);
      props.dataChannel.addEventListener("open", handleOpen);
      props.dataChannel.addEventListener("close", handleClose);
      props.dataChannel.addEventListener("error", handleError);
    }

    return () => {
      if (props.dataChannel) {
        props.dataChannel.removeEventListener("message", handleMessage);
        props.dataChannel.removeEventListener("open", handleOpen);
        props.dataChannel.removeEventListener("close", handleClose);
        props.dataChannel.removeEventListener("error", handleError);
      }
    };
  }, [props.dataChannel]);

  useEffect(() => {
    props.onSessionStatusChange(sessionStatus);
  }, [sessionStatus, props.onSessionStatusChange]);

  useEffect(() => {
    if (
      sessionStatus === "CONNECTED" &&
      props.instructions &&
      props.dataChannel?.readyState === "open"
    ) {
      // Removed console.log about instructions
      updateSession();
    }
  }, [props.instructions, props.tools, sessionStatus, props.dataChannel?.readyState]);

  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      console.log(
        `updatingSession, isPTTACtive=${isPTTActive} sessionStatus=${sessionStatus}`
      );
      updateSession();
    }
  }, [isPTTActive, props.isTranscriptionEnabled]);

  const updateSession = () => {
    if (!props.dataChannel || props.dataChannel.readyState !== "open") {
      console.warn("Cannot update session - data channel not ready");
      return;
    }

    sendClientEvent(
      { type: "input_audio_buffer.clear" },
      "clear audio buffer on session update"
    );

    const turnDetection = isPTTActive || !props.isTranscriptionEnabled
      ? null
      : {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 540,
          create_response: true,
        };

    const sessionUpdateEvent = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: props.instructions,
        tools: props.tools || [],
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: props.isTranscriptionEnabled ? { model: "whisper-1" } : null,
        turn_detection: turnDetection,
      },
    };

    console.log("Session update event full details:", sessionUpdateEvent);
    sendClientEvent(sessionUpdateEvent);
  };

  const cancelAssistantSpeech = async () => {
    const mostRecentAssistantMessage = [...transcriptItems]
      .reverse()
      .find((item) => item.role === "assistant");

    if (!mostRecentAssistantMessage) {
      console.warn("can't cancel, no recent assistant message found");
      return;
    }
    if (mostRecentAssistantMessage.status === "DONE") {
      console.log("No truncation needed, message is DONE");
      return;
    }

    sendClientEvent({
      type: "conversation.item.truncate",
      item_id: mostRecentAssistantMessage?.itemId,
      content_index: 0,
      audio_end_ms: Date.now() - mostRecentAssistantMessage.createdAtMs,
    });
    sendClientEvent(
      { type: "response.cancel" },
      "(cancel due to user interruption)"
    );
  };

  const handleSendTextMessage = () => {
    if (!userText.trim()) return;
    cancelAssistantSpeech();

    const id = uuidv4().slice(0, 32);
    addTranscriptMessage(id, "user", userText.trim(), false);

    sendClientEvent(
      {
        type: "conversation.item.create",
        item: {
          id,
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: userText.trim() }],
        },
      },
      "(send user text message)"
    );
    setUserText("");

    sendClientEvent({ type: "response.create" }, "trigger response");
  };

  useEffect(() => {
    const storedPushToTalkUI = localStorage.getItem("pushToTalkUI");
    if (storedPushToTalkUI) {
      setIsPTTActive(storedPushToTalkUI === "true");
    }
    const storedAudioPlaybackEnabled = localStorage.getItem(
      "audioPlaybackEnabled"
    );
    if (storedAudioPlaybackEnabled) {
      setIsAudioPlaybackEnabled(storedAudioPlaybackEnabled === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pushToTalkUI", isPTTActive.toString());
  }, [isPTTActive]);

  useEffect(() => {
    localStorage.setItem(
      "audioPlaybackEnabled",
      isAudioPlaybackEnabled.toString()
    );
  }, [isAudioPlaybackEnabled]);

  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaybackEnabled) {
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay may be blocked by browser:", err);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaybackEnabled]);

  return (
    <div className="flex flex-col h-[500px] bg-white">
      <div className="flex flex-1 overflow-hidden relative">
        <Transcript
          userText={userText}
          setUserText={setUserText}
          onSendMessage={handleSendTextMessage}
          canSend={
            sessionStatus === "CONNECTED" &&
            props.dataChannel?.readyState === "open"
          }
        />
      </div>
    </div>
  );
}

export default CopilotDemoApp;
