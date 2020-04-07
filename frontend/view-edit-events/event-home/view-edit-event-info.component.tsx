import React from "react";
import dayjs from "dayjs";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";

export default function ViewEditEventInfo(props: ViewEditEventInfoProps) {
  const { event } = props;
  const today = new Date();
  const [isPastDate, setIsPastDate] = React.useState(
    dayjs(event.eventDate).isBefore(today) || false
  );

  return (
    <EventSection title="Event Information">
      <table className="event-table">
        <tbody>
          <tr>
            <td>Event Name:</td>
            <td>{event.eventName}</td>
          </tr>
          <tr>
            <td>Event Date:</td>
            <td style={{ color: `${isPastDate ? "black" : "red"}` }}>
              {event.eventDate}
            </td>
          </tr>
          <tr>
            <td>Event Location:</td>
            <td>{event.eventLocation}</td>
          </tr>
          <tr>
            <td>Total Attendance:</td>
            <td>{event.totalAttendance}</td>
          </tr>
        </tbody>
      </table>
    </EventSection>
  );
}

ViewEditEventInfo.defaultProps = { editable: true };

function updatingReducer(state, action) {
  switch (action.type) {
    case "edit":
      return { isEditing: true };
    case "update":
      return {
        isEditing: false,
        isUpdating: true,
        newEventData: action.newEventData,
      };
    case "reset":
      return {
        isEditing: false,
        isUpdating: false,
      };
    default:
      throw Error();
  }
}

type ViewEditEventInfoProps = {
  event: SingleEvent;
  eventUpdated?(event: SingleEvent): void;
  editable?: boolean;
};
