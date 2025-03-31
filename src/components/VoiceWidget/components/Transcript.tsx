import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight } from "lucide-react";
import { useTranscript } from "../contexts/TranscriptContext";

export interface TranscriptProps {
  userText?: string;
  setUserText?: (val: string) => void;
  onSendMessage?: () => void;
  canSend?: boolean;
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
}

function Transcript({
  userText = "",
  setUserText = () => {},
  onSendMessage = () => {},
  canSend = true,
  messages = [],
}: TranscriptProps) {
  const { transcriptItems, toggleTranscriptItemExpand } = useTranscript();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [transcriptItems, messages]);

  useEffect(() => {
    if (canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canSend]);

  const renderContent = () => {
    if (messages && messages.length > 0) {
      return messages.map((message, index) => {
        const isUser = message.role === "user";
        const baseContainer = "flex justify-end flex-col my-2";
        const containerClasses = `${baseContainer} ${isUser ? "items-end" : "items-start"}`;
        const bubbleBase = `max-w-[85%] p-3 rounded-xl ${isUser ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-black"}`;
        const timestamp = message.timestamp || new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={index} className={containerClasses}>
            <div className={bubbleBase}>
              <div className={`text-xs ${isUser ? "text-gray-400" : "text-gray-500"} font-mono mb-1`}>
                {timestamp}
              </div>
              <div className="whitespace-pre-wrap">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      });
    }

    return transcriptItems.map((item) => {
      const { itemId, type, role, data, expanded, timestamp, title = "", isHidden } = item;

      if (isHidden) {
        return null;
      }

      if (type === "MESSAGE") {
        const isUser = role === "user";
        const baseContainer = "flex justify-end flex-col my-2";
        const containerClasses = `${baseContainer} ${isUser ? "items-end" : "items-start"}`;
        const bubbleBase = `max-w-[85%] p-3 rounded-xl ${isUser ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-black"}`;
        const isBracketedMessage = title.startsWith("[") && title.endsWith("]");
        const messageStyle = isBracketedMessage ? "italic text-gray-400" : "";
        const displayTitle = isBracketedMessage ? title.slice(1, -1) : title;

        return (
          <div key={itemId} className={containerClasses}>
            <div className={bubbleBase}>
              <div className={`text-xs ${isUser ? "text-gray-400" : "text-gray-500"} font-mono mb-1`}>
                {timestamp}
              </div>
              <div className={`whitespace-pre-wrap ${messageStyle}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayTitle}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      } else if (type === "BREADCRUMB") {
        return (
          <div
            key={itemId}
            className="flex flex-col justify-start items-start text-gray-500 text-sm"
          >
            <span className="text-xs font-mono">{timestamp}</span>
            <div
              className={`whitespace-pre-wrap flex items-center font-mono text-sm text-gray-800 ${
                data ? "cursor-pointer" : ""
              }`}
              onClick={() => data && toggleTranscriptItemExpand(itemId)}
            >
              {data && (
                <span
                  className={`text-gray-400 mr-1 transform transition-transform duration-200 select-none font-mono ${
                    expanded ? "rotate-90" : "rotate-0"
                  }`}
                >
                  ▶
                </span>
              )}
              {title}
            </div>
            {expanded && data && (
              <div className="text-gray-800 text-left">
                <pre className="border-l-2 ml-1 border-gray-200 whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={itemId}
            className="flex justify-center text-gray-500 text-sm italic font-mono"
          >
            Unknown item type: {type}{" "}
            <span className="ml-2 text-xs">{timestamp}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0 rounded-xl">
      <div className="relative flex-1 min-h-0">
        <div
          ref={transcriptRef}
          className="overflow-auto p-4 flex flex-col gap-y-2 h-full"
        >
          {renderContent()}
        </div>
      </div>

      {userText !== undefined && (
        <div className="p-4 flex items-center gap-x-4">
          <div className="flex-1 flex items-center bg-[#f3f3ee] rounded-full px-6 py-4">
            <input
              ref={inputRef}
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSend && userText.trim()) {
                  onSendMessage();
                }
              }}
              disabled={!canSend}
              className="flex-1 bg-transparent text-[#16161D] placeholder-[#4B4B4B] focus:outline-none text-lg"
              placeholder="Talk to Atelier here"
            />
            {canSend && (
              <div className="flex items-center gap-x-4">
                <button
                  onClick={onSendMessage}
                  disabled={!userText.trim()}
                  className={`p-1 transition-colors ${
                    userText.trim() ? "text-[#16161D]" : "text-[#4B4B4B]"
                  }`}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Transcript;
