import React, { createContext, useContext, useState, useRef } from "react";
import { TranscriptItem } from "../types";

interface TranscriptContextType {
  transcriptItems: TranscriptItem[];
  addTranscriptMessage: (
    itemId: string,
    role: "user" | "assistant",
    title: string,
    isPending?: boolean
  ) => void;
  addTranscriptBreadcrumb: (title: string, data?: Record<string, any>) => void;
  updateTranscriptMessage: (
    itemId: string,
    delta: string,
    isAppending: boolean
  ) => void;
  updateTranscriptItemStatus: (
    itemId: string,
    status: "IN_PROGRESS" | "DONE"
  ) => void;
  hideTranscriptItem: (itemId: string) => void;
  toggleTranscriptItemExpand: (itemId: string) => void;
  resetTranscript: () => void;
}

const TranscriptContext = createContext<TranscriptContextType>({
  transcriptItems: [],
  addTranscriptMessage: () => {},
  addTranscriptBreadcrumb: () => {},
  updateTranscriptMessage: () => {},
  updateTranscriptItemStatus: () => {},
  hideTranscriptItem: () => {},
  toggleTranscriptItemExpand: () => {},
  resetTranscript: () => {},
});

export const TranscriptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const breadcrumbCounter = useRef<number>(0);

  const addTranscriptMessage = (
    itemId: string,
    role: "user" | "assistant",
    title: string,
    isPending = false
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTranscriptItems((prevItems) => {
      if (prevItems.some((item) => item.itemId === itemId)) {
        return prevItems;
      }

      const newItem: TranscriptItem = {
        itemId,
        type: "MESSAGE",
        role,
        title: isPending ? "[Transcribing...]" : title,
        expanded: false,
        timestamp,
        createdAtMs: now.getTime(),
        status: isPending ? "IN_PROGRESS" : "DONE",
        isHidden: false,
      };

      return [...prevItems, newItem];
    });
  };

  const addTranscriptBreadcrumb = (
    title: string,
    data?: Record<string, any>
  ) => {
    const uniqueCounter = breadcrumbCounter.current++;
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const itemId = `breadcrumb-${uniqueCounter}-${Date.now()}-${randomSuffix}`;
    
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTranscriptItems((prevItems) => [
      ...prevItems,
      {
        itemId,
        type: "BREADCRUMB",
        title,
        data,
        expanded: false,
        timestamp,
        createdAtMs: now.getTime(),
        status: "DONE",
        isHidden: false,
      },
    ]);

    return itemId;
  };

  const updateTranscriptMessage = (
    itemId: string,
    delta: string,
    isAppending: boolean
  ) => {
    setTranscriptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            title: isAppending ? (item.title || "") + delta : delta,
          };
        }
        return item;
      })
    );
  };

  const updateTranscriptItemStatus = (
    itemId: string,
    status: "IN_PROGRESS" | "DONE"
  ) => {
    setTranscriptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            status,
          };
        }
        return item;
      })
    );
  };

  const hideTranscriptItem = (itemId: string) => {
    setTranscriptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            isHidden: true,
          };
        }
        return item;
      })
    );
  };

  const toggleTranscriptItemExpand = (itemId: string) => {
    setTranscriptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            expanded: !item.expanded,
          };
        }
        return item;
      })
    );
  };

  const resetTranscript = () => {
    setTranscriptItems([]);
    breadcrumbCounter.current = 0;
  };

  return (
    <TranscriptContext.Provider
      value={{
        transcriptItems,
        addTranscriptMessage,
        addTranscriptBreadcrumb,
        updateTranscriptMessage,
        updateTranscriptItemStatus,
        hideTranscriptItem,
        toggleTranscriptItemExpand,
        resetTranscript,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => useContext(TranscriptContext);
