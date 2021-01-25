import React from "react";
import { useCss } from "kremling";

export default function EventSection(props: EventSectionProps) {
  const [expanded, setExpanded] = React.useState(() =>
    localStorage.getItem(`cu-event-section-expanded:${props.title}`)
      ? JSON.parse(
          localStorage.getItem(`cu-event-section-expanded:${props.title}`)
        )
      : true
  );

  const scope = useCss(css);

  const toggleExpandedAndStore = () => {
    localStorage.setItem(
      `cu-event-section-expanded:${props.title}`,
      JSON.stringify(!expanded)
    );
    setExpanded(!expanded);
  };

  return (
    <div className="card padding-0" {...scope}>
      <button
        className="unstyled event-section-header"
        onClick={toggleExpandedAndStore}
      >
        <h1>{props.title}</h1>
      </button>
      {expanded && (
        <div className="event-section-content">{props.children}</div>
      )}
    </div>
  );
}

type EventSectionProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const css = `
  & h1 {
    font-size: 2.1rem;
  }
  
  & button.unstyled.event-section-header {
    padding: 1.6rem 3.2rem;
    width: 100%;
  }

  & button.unstyled.event-section-header:hover {
    background-color: var(--light-gray);
  }

  & .event-section-content {
    padding: 1.6rem 3.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  & table.event-table {
    width: 100%;
    table-layout: fixed;
  }
  
  & table.event-table td:first-child {
    text-align: right;
    padding-right: 1.2rem;
    width: 50%;
    max-width: 50%;
  }
  
  & table.event-table td:last-child {
    padding-left: 1.2rem;
  }

  & table.event-table tr:not(:first-child) td {
    padding-top: .4rem;
  }

  & table.event-table tr:not(:last-child) td {
    padding-bottom: .4rem;
  }
`;
