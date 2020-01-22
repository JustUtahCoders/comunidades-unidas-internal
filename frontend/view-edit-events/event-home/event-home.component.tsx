import React from "react";
import { SingleEvent } from "../view-event.component";
import ViewEditEventInfo from "./view-edit-event-info.component";
import ViewEventStats from "./view-event-stats.component";

export default function EventHome(props: EventHomeProps) {
  const { event, setEvent } = props;

  if (!event || typeof event !== "object") {
    return null;
  }

  return (
    <div style={{ marginBottom: "3.2rem" }}>
      <ViewEditEventInfo event={event} eventUpdated={setEvent} />
      <ViewEventStats event={event} />
    </div>
  );
}

type EventHomeProps = {
  path: string;
  event: SingleEvent;
  setEvent(newEvent: SingleEvent): any;
};
