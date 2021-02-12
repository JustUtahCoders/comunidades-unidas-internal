import React from "react";
import { useCss } from "kremling";
import AddLeadStepHeader from "./add-lead-step-header.component";
import imgSrc from "../../icons/148705-essential-collection/svg/map-location.svg";
import dayjs from "dayjs";
import easyFetch from "../util/easy-fetch";
import { mediaDesktop } from "../styleguide.component";
import Modal from "../util/modal.component";
import AddEditMaterials from "./add-edit-materials.component";
import { handlePromiseError } from "../util/error-helpers";
import EventMaterial from "../view-edit-events/event-home/event-material.component";

export default function AddEventStep(props: AddEventStepProps) {
  const scope = useCss(css);
  const [eventType, setEventType] = React.useState<EventType>(
    EventType.existingEvent
  );
  const [eventDate, setEventDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [allEvents, setAllEvents] = React.useState([]);
  const [eventName, setEventName] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("");
  const [totalAttendance, setTotalAttendance] = React.useState(1);
  const [createNewEvent, setCreateNewEvent] = React.useState(false);
  const [existingEventId, setExistingEventId] = React.useState<ExistingEventId>(
    ""
  );
  const [materials, setMaterials] = React.useState([]);
  const [materialDistributed, setMaterialDistributed] = React.useState([]);
  const [showMaterials, setShowMaterials] = React.useState(false);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/materials`, { signal: ac.signal })
      .then(setMaterials)
      .catch(handlePromiseError);
    return () => {
      ac.abort();
    };
  }, []);

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/events`, { signal: abortController.signal })
      .then((data) => {
        if (data.events.length === 0) {
          setEventType(EventType.newEvent);
        }
        setAllEvents(data.events);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      abortController.abort();
    };
  }, []);

  React.useEffect(() => {
    if (createNewEvent) {
      const abortController = new AbortController();
      easyFetch(`/api/events`, {
        signal: abortController.signal,
        method: "POST",
        body: {
          eventDate,
          eventName,
          eventLocation,
          totalAttendance,
          materialsDistributed: materialDistributed,
        },
      })
        .then((event) => {
          props["navigate"](`/add-leads/event/${event.id}`);
        })
        .catch((err) => {
          setCreateNewEvent(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [createNewEvent]);

  return (
    <>
      <AddLeadStepHeader
        text="Let's check for an event that the leads attended"
        imgSrc={imgSrc}
        imgAlt="Map Location icon"
      />
      <form className="add-event-form" onSubmit={handleSubmit} {...scope}>
        <div role="radiogroup" aria-labelledby="event-type-label">
          <label id="event-type-label">Source:</label>
          <div className="radios">
            <div>
              <input
                id="new-event"
                type="radio"
                name="event-type"
                required
                checked={eventType === EventType.newEvent}
                onChange={(evt) => setEventType(EventType.newEvent)}
              />
              <label htmlFor="new-event">New Event</label>
            </div>
            <div>
              <input
                id="existing-event"
                type="radio"
                name="event-type"
                required
                checked={eventType === EventType.existingEvent}
                onChange={(evt) => setEventType(EventType.existingEvent)}
              />
              <label htmlFor="existing-event">Existing Event</label>
            </div>
            <div>
              <input
                id="no-event"
                type="radio"
                name="event-type"
                required
                checked={eventType === EventType.other}
                onChange={(evt) => setEventType(EventType.other)}
              />
              <label htmlFor="no-event">Other</label>
            </div>
          </div>
        </div>
        {inputs()}
      </form>
      {showMaterials && (
        <Modal headerText="Edit Materials" close={closeShowMaterials}>
          <AddEditMaterials
            addMaterial={addMaterial}
            deleteMaterial={deleteMaterial}
            editMaterial={editMaterial}
            materials={materials}
          />
        </Modal>
      )}
    </>
  );

  function addMaterial(material) {
    setMaterials([...materials, material]);
  }

  function deleteMaterial(materialId) {
    setMaterials(materials.filter((m) => m.id !== materialId));
  }

  function editMaterial(material) {
    const updateMaterial = materials.map((m) => {
      if (m.id === material.id) return material;
      return m;
    });
    setMaterials(updateMaterial);
  }

  function closeShowMaterials() {
    setShowMaterials(false);
  }

  function inputs() {
    if (eventType === EventType.newEvent) {
      return newEventInputs();
    } else if (eventType === EventType.existingEvent) {
      return existingEventInputs();
    } else {
      return otherSourceInputs();
    }
  }

  function otherSourceInputs() {
    return (
      <div className="actions">
        <button className="primary" type="submit">
          Next step
        </button>
      </div>
    );
  }

  function existingEventInputs() {
    return (
      <>
        <div>
          <label htmlFor="existing-events-list">Choose event:</label>
          <select
            id="existing-events-list"
            value={existingEventId}
            onChange={(evt) => setExistingEventId(Number(evt.target.value))}
          >
            <option value="">(Select an event)</option>
            {allEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName} ({event.eventDate})
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button className="primary" type="submit" disabled={!existingEventId}>
            Reuse event
          </button>
        </div>
      </>
    );
  }

  function newEventInputs() {
    return (
      <>
        <div>
          <label htmlFor="event-date">Event Date:</label>
          <input
            id="event-date"
            type="date"
            value={eventDate}
            onChange={(evt) => setEventDate(evt.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="event-name">Event Name:</label>
          <input
            id="event-name"
            type="text"
            value={eventName}
            onChange={(evt) => setEventName(evt.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="event-location">Location:</label>
          <input
            id="event-location"
            type="text"
            value={eventLocation}
            onChange={(evt) => setEventLocation(evt.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="event-attendance">Attendees:</label>
          <input
            id="event-attendance"
            type="number"
            value={totalAttendance}
            onChange={(evt) => setTotalAttendance(Number(evt.target.value))}
            required
            min={1}
          />
        </div>
        <div>
          <label>Materials:</label>
          <div>
            <EventMaterial
              materials={materials}
              materialDistributed={materialDistributed}
              setMaterialDistributed={setMaterialDistributed}
              setShowMaterials={setShowMaterials}
            />
          </div>
        </div>
        <div className="actions">
          <button className="primary" type="submit" disabled={createNewEvent}>
            Create event
          </button>
        </div>
      </>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    switch (eventType) {
      case EventType.newEvent:
        setCreateNewEvent(true);
        return;
      case EventType.existingEvent:
        props["navigate"](`/add-leads/event/${existingEventId}`);
        return;
      default:
        props["navigate"](`/add-leads/no-event`);
        return;
    }
  }
}

const css = `
& h2 {
  margin: 0;
  font-size: 21px;
}

& .add-event-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2.4rem auto 0 auto;
}

& .event-material {
  padding: .8rem 0;
}

${mediaDesktop} {
  & .add-event-form {
    width: 40rem;
  }

  & .add-event-form > div > label {
    min-width: 15rem;
    width: 15rem;
  }
}

& .add-event-form > div {
  margin-top: 1.6rem;
  display: flex;
  align-items: center;
  width: 100%;
}

& .add-event-form > div > label {
  text-align: right;
  margin-right: 1.6rem;
}

& .actions {
  display: flex;
  justify-content: center;
}

& .radios input {
  margin-right: .4rem;
}

& .radios label {
  margin-right: 1.6rem;
}
`;

type AddEventStepProps = {
  path: string;
};

type ExistingEventId = number | "";

enum EventType {
  newEvent = "newEvent",
  existingEvent = "existingEvent",
  other = "other",
}
