import React from "react";
import dayjs from "dayjs";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";
import { cloneDeep } from "lodash-es";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";

export default function ViewEditEventInfo(props: ViewEditEventInfoProps) {
  const { event } = props;
  const today = new Date();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [modifiedEventInfo, setModifiedEventInfo] = React.useState(null);

  React.useEffect(() => {
    if (!isEditing) {
      setModifiedEventInfo(cloneDeep(props.event));
    }
  }, [isEditing, props.event]);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/events/${event.id}`, {
        method: "PATCH",
        signal: abortController.signal,
        body: {
          eventName: modifiedEventInfo.eventName,
          eventLocation: modifiedEventInfo.eventLocation,
          eventDate: modifiedEventInfo.eventDate,
          attendanceMale: modifiedEventInfo.attendanceMale,
          attendanceFemale: modifiedEventInfo.attendanceFemale,
          attendanceOther: modifiedEventInfo.attendanceOther,
          attendanceUnknown: modifiedEventInfo.attendanceUnknown,
        },
      })
        .then((updatedEvent) => {
          props.eventUpdated(updatedEvent);
          showGrowl({ type: GrowlType.success, message: "Event was updated." });
          setIsEditing(false);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setIsSaving(false);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving, modifiedEventInfo, props.eventUpdated]);

  React.useEffect(() => {
    if (modifiedEventInfo) {
      setModifiedEventInfo({
        ...modifiedEventInfo,
        totalAttendance:
          modifiedEventInfo.attendanceMale +
          modifiedEventInfo.attendanceFemale +
          modifiedEventInfo.attendanceOther +
          modifiedEventInfo.attendanceUnknown,
      });
    }
  }, [
    modifiedEventInfo?.attendanceMale,
    modifiedEventInfo?.attendanceFemale,
    modifiedEventInfo?.attendanceOther,
    modifiedEventInfo?.attendanceUnknown,
  ]);

  return (
    <EventSection title="Event Information">
      <table className="event-table">
        <tbody>
          <tr>
            <td>Event Name:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  value={modifiedEventInfo.eventName}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      eventName: evt.target.value,
                    })
                  }
                />
              ) : (
                event.eventName
              )}
            </td>
          </tr>
          <tr>
            <td>Event Date:</td>
            <td>
              {isEditing ? (
                <input
                  type="date"
                  value={modifiedEventInfo.eventDate}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      eventDate: evt.target.value,
                    })
                  }
                />
              ) : (
                <div
                  style={{
                    color: `${
                      dayjs(event.eventDate).isBefore(today) ? "black" : "red"
                    }`,
                  }}
                >
                  {event.eventDate}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>Event Location:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  value={modifiedEventInfo.eventLocation}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      eventLocation: evt.target.value,
                    })
                  }
                />
              ) : (
                event.eventLocation
              )}
            </td>
          </tr>
          <tr>
            <td>Attendance (women):</td>
            <td>
              {isEditing ? (
                <input
                  type="number"
                  value={modifiedEventInfo.attendanceFemale}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      attendanceFemale: Number(evt.target.value),
                    })
                  }
                />
              ) : (
                event.attendanceFemale
              )}
            </td>
          </tr>
          <tr>
            <td>Attendance (men):</td>
            <td>
              {isEditing ? (
                <input
                  type="number"
                  value={modifiedEventInfo.attendanceMale}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      attendanceMale: Number(evt.target.value),
                    })
                  }
                />
              ) : (
                event.attendanceMale
              )}
            </td>
          </tr>
          <tr>
            <td>Attendance (other):</td>
            <td>
              {isEditing ? (
                <input
                  type="number"
                  value={modifiedEventInfo.attendanceOther}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      attendanceOther: Number(evt.target.value),
                    })
                  }
                />
              ) : (
                event.attendanceOther
              )}
            </td>
          </tr>
          <tr>
            <td>Attendance (unknown):</td>
            <td>
              {isEditing ? (
                <input
                  type="number"
                  value={modifiedEventInfo.attendanceUnknown}
                  onChange={(evt) =>
                    setModifiedEventInfo({
                      ...modifiedEventInfo,
                      attendanceUnknown: Number(evt.target.value),
                    })
                  }
                />
              ) : (
                event.attendanceUnknown
              )}
            </td>
          </tr>
          <tr>
            <td>Total Attendance:</td>
            <td>
              {(modifiedEventInfo
                ? modifiedEventInfo.totalAttendance
                : event.totalAttendance
              ).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: "1.6rem" }}>
        {isEditing ? (
          <>
            <button className="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="primary" onClick={() => setIsSaving(true)}>
              Save
            </button>
          </>
        ) : (
          <button className="primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
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
