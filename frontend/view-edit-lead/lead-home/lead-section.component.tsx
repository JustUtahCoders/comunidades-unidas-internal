import React from "react";
import { useCss } from "kremling";
import LeadMetadata from "./lead-metadata.component";

export default function LeadSection(props: LeadSectionProps) {
  const { title, metadata, children } = props;
  const [expanded, setExpanded] = React.useState(() =>
    localStorage.getItem(`cu-lead-section-expanded:${title}`)
      ? JSON.parse(localStorage.getItem(`cu-lead-section-expanded:${title}`))
      : true
  );

  const scope = useCss(css);

  const toggleExpandAndStore = () => {
    localStorage.setItem(
      `cu-lead-section-expanded:${title}`,
      JSON.stringify(!expanded)
    );
    setExpanded(!expanded);
  };

  return (
    <div className="card padding-0" {...scope}>
      <button
        className="unstyled lead-section-header"
        onClick={toggleExpandAndStore}
      >
        <h1>{title}</h1>
        {metadata && <LeadMetadata metadata={metadata} />}
      </button>
      {expanded && <div className="lead-section-content">{children}</div>}
    </div>
  );
}

type LeadSectionProps = {
  title: string;
  metadata?: {
    createdBy: {
      firstName: string;
      lastName: string;
      timestamp: string;
    };
    lastUpdatedBy: {
      firstName: string;
      lastName: string;
      timestamp: string;
    };
  };
  children: JSX.Element | JSX.Element[];
};

const css = `
  & h1 {
    font-size: 2.1rem;
  }

  & .lead-metadata {
    font-style: italic;
    font-size: 1.2rem;
    text-align: center;
  }

  & button.unstyled.lead-section-header {
    padding: 1.6rem 3.2rem;
    width: 100%;
  }

  & button.unstyled.lead-section-header:hover {
    background-color: var(--light-gray);
  }

  & .lead-section-content {
    padding: 1.6rem 3.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  & table.lead-table {
    width: 100%;
    table-layout: fixed;
  }

  & table.lead-table td:first-child {
    text-align: right;
    padding-right: 1.2rem;
    width: 50%;
    max-width: 50%;
  }

  & table.lead-table td:last-child {
    padding-left: 1.2rem;
  }

  & table.lead-table tr:not(:first-child) td {
    padding-top: .4rem;
  }

  & table.lead-table tr:not(:last-child) td {
    padding-bottom: .4rem;
  }

  & table.lead-service-table {
    width: 100%;
    table-layout: fixed;
    border: 3px var(--medium-gray) solid;
    padding: 1rem;
  }

  & table.lead-service-table th {
    border-bottom: 2px var(--medium-gray) solid;
    padding-bottom: 1rem;
  }

  & table.lead-service-table td {
    border-bottom: 1px var(--light-gray) solid;
    border-right: 1px var(--light-gray) solid;
    padding: 1rem;
  }

  & table.lead-service-table td:last-child {
    border-right: none;
  }

  & table.lead-service-table tr:last-child td {
    border-bottom: none;
    padding: 1rem 1rem 0 1rem;
  }
`;
