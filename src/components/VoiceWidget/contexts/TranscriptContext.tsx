
import React, { createContext, useContext, useState } from "react";
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
}

const TranscriptContext = createContext<TranscriptContextType>({
  transcriptItems: [],
  addTranscriptMessage: () => {},
  addTranscriptBreadcrumb: () => {},
  updateTranscriptMessage: () => {},
  updateTranscriptItemStatus: () => {},
  hideTranscriptItem: () => {},
  toggleTranscriptItemExpand: () => {},
});

export const TranscriptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);

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
      // Check if the item already exists to avoid duplicates
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
    const itemId = `breadcrumb-${transcriptItems.length}-${Date.now()}`;
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
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => useContext(TranscriptContext);
