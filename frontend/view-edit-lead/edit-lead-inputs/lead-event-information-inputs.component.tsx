import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";

export default function LeadEventsInformationInputs(
  props: LeadEventsInformationInputsProps
) {
  const [events, setEvents] = React.useState([]);
  const [leadEvents, setLeadEvents] = React.useState(props.lead.eventSources);
  const [selectedEvent, setSelectedEvent] = React.useState(0);
  const scope = useCss(css);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/events", { signal: abortController.signal })
      .then(data => setEvents(data.events))
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  const mapEvents = events.map(event => {
    let isDisabled = false;

    for (let i = 0; i < leadEvents.length; i++) {
      if (event.id == leadEvents[i]) {
        isDisabled = true;
      }
    }

    return (
      <option value={event.id} key={event.id} disabled={isDisabled}>
        {event.eventName} ({event.eventDate})
      </option>
    );
  });

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="edit-form"
      {...scope}
    >
      <div>
        <label className="event-select">
          <span>Add an attended event</span>
          <select
            value={selectedEvent}
            onChange={evt => setSelectedEvent(parseInt(evt.target.value))}
          >
            <option value={0}>Select an event</option>
            {mapEvents}
          </select>
        </label>
      </div>
      <div className="children-container">{props.children}</div>
    </form>
  );

  function handleSubmit(evt) {
    evt.preventDefault();

    if (selectedEvent === 0) {
      // "Select an event" option
      return;
    }

    return props.handleSubmit(evt, {
      eventSources: [...leadEvents, selectedEvent]
    });
  }
}

const css = `
  & .event-select {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  & .event-select > span {
    margin-bottom: 1rem;
  }
`;

type LeadEventsInformationInputsProps = {
  lead: LeadEventsInfo;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: LeadEventsInfo);
};

type LeadEventsInfo = {
  eventSources: Array<number>;
};
