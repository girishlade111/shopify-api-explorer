
import React, { createContext, useContext, useState } from "react";
import { LoggedEvent, ServerEvent } from "../types";

interface EventContextType {
  loggedEvents: LoggedEvent[];
  logClientEvent: (
    eventData: Record<string, any>,
    eventNameSuffix?: string
  ) => void;
  logServerEvent: (eventData: ServerEvent) => void;
  toggleExpand: (id: number) => void;
}

const EventContext = createContext<EventContextType>({
  loggedEvents: [],
  logClientEvent: () => {},
  logServerEvent: () => {},
  toggleExpand: () => {},
});

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);
  const [nextId, setNextId] = useState(1);

  const logEvent = (
    direction: "client" | "server",
    eventName: string,
    eventData: Record<string, any>
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const id = nextId;
    setNextId(nextId + 1);

    setLoggedEvents((prevLogs) => [
      ...prevLogs,
      {
        id,
        direction,
        expanded: false,
        timestamp,
        eventName,
        eventData,
      },
    ]);
  };

  const logClientEvent = (
    eventData: Record<string, any>,
    eventNameSuffix = ""
  ) => {
    const eventName = `${eventData.type || "unknown"}${
      eventNameSuffix ? ` ${eventNameSuffix}` : ""
    }`;
    logEvent("client", eventName, eventData);
  };

  const logServerEvent = (eventData: ServerEvent) => {
    logEvent("server", eventData.type || "unknown", eventData);
  };

  const toggleExpand = (id: number) => {
    setLoggedEvents((prevLogs) =>
      prevLogs.map((log) => {
        if (log.id === id) {
          return {
            ...log,
            expanded: !log.expanded,
          };
        }
        return log;
      })
    );
  };

  return (
    <EventContext.Provider
      value={{
        loggedEvents,
        logClientEvent,
        logServerEvent,
        toggleExpand,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
