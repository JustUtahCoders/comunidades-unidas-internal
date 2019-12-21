import React from "react";
import { useCss } from "kremling";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";

export default function ViewEventStats(props: ViewEventStatsProps) {
  const { event } = props;

  const [leadPercentage, setLeadPercentage] = React.useState(
    event.totalLeads / event.totalAttendance || 0
  );
  const [clientPercentage, setClientPercentage] = React.useState(
    event.totalConvertedToClients / event.totalAttendance || 0
  );

  const scope = useCss(css);

  const tickCounts = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const mapTickCounts = tickCounts.map(tick => {
    return (
      <div className="tick-container" key={tick}>
        <div className="tick" />
        <p>{tick}%</p>
      </div>
    );
  });

  return (
    <EventSection title="Event Stats">
      <div className="chart-container" {...scope}>
        <div className="label-container">
          <p>Total Attendance</p>
          <p>Leads from Event</p>
          <p>Converted To Clients</p>
        </div>
        <div className="chart-grid-container">
          <div
            className="chart-bar total-attendance"
            style={{ width: "40rem" }}
          >
            {event.totalAttendance > 0 && <p>{event.totalAttendance}</p>}
          </div>
          <div
            className="chart-bar total-leads"
            style={{ width: `${leadPercentage * 40 + 1}rem` }}
          >
            {event.totalLeads > 0 && <p>{event.totalLeads}</p>}
          </div>
          <div
            className="chart-bar total-clients"
            style={{ width: `${clientPercentage * 40 + 1}rem` }}
          >
            {event.totalConvertedToClients > 0 && (
              <p>{event.totalConvertedToClients}</p>
            )}
          </div>
        </div>
        <div className="ticks-container">{mapTickCounts}</div>
      </div>
    </EventSection>
  );
}

type ViewEventStatsProps = {
  event: SingleEvent;
};

const css = `
  & .chart-container {
    display: grid;
    grid-template-column: 1fr 1fr;
    grid-template-row: 1fr 1fr;
  }

  & .label-container {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-contents: space-around;
    padding-right: 1rem;
  }

  & .label-container > p {
    margin-top: 2.25rem;
    heigt: 5rem;
    width: 100%;
    text-align: right;
  }

  & .chart-grid-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-contents: space-around;
    grid-column: 2;
    grid-row: 1;
    height: 20rem;
    width: 42rem;
    border-left: solid black 0.5rem;
    border-bottom: solid black 0.5rem;
  }

  & .chart-bar {
    display: flex;
    align-items: center;
    justify-contents: flex-end;
    margin: 2rem 0 1rem 0;
    height: 3rem;
    min-width: 0.25rem;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    border-radius: 0 5px 5px 0;
  }

  & .chart-bar > p {
    width: 100%;
    color: white;
    font-size: 1.5rem;
    text-align: center;
  }

  & .total-attendance {
    background-color: blue;
  }

  & .total-leads {
    background-color: purple;
  }

  & .total-clients {
    background-color: red;
  }

  & .ticks-container {
    grid-column: 2;
    grid-row: 2;
    width: 42rem;
    display: flex;
    align-items: center;
    justify-contents: center;
  }

  & .tick-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-contents: center;
    font-size: 1rem;
    width: 3rem;
    margin-right: 1rem;
  }

  & .tick {
    display: inline;
    height: 2rem;
    width: 2px;
    background-color: black;
  }

  & .tick-container > p {
    display: inline;
  }
`;
