import React from "react";
import { useCss } from "kremling";
import { css as addClientCss } from "../add-client/add-client.component";
import AuditSummarySection from "./audit-summary-section.component";
import { LastUpdate } from "./view-client.component";

export default function ClientSection(props: ClientSectionProps) {
  const [expanded, setExpanded] = React.useState(() =>
    localStorage.getItem(`cu-client-section-expandeded:${props.title}`)
      ? JSON.parse(
          localStorage.getItem(`cu-client-section-expanded:${props.title}`)
        )
      : true
  );

  const scope = useCss(css);

  const toggleExpandAndStore = () => {
    localStorage.setItem(
      `cu-client-section-expanded:${props.title}`,
      JSON.stringify(!expanded)
    );
    setExpanded(!expanded);
  };

  return (
    <div className="card padding-0" {...scope}>
      <button
        className="unstyled client-section-header"
        onClick={toggleExpandAndStore}
      >
        <h3>{props.title}</h3>
        {props.auditSection && (
          <div className="audit-info">
            <AuditSummarySection auditSection={props.auditSection} />
          </div>
        )}
      </button>
      {expanded && (
        <div className="client-section-content">{props.children}</div>
      )}
    </div>
  );
}

type ClientSectionProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
  auditSection: {
    numWrites?: number;
    lastUpdate: LastUpdate;
  };
};

const css = `
& button.unstyled.client-section-header {
  padding: 1.6rem 3.2rem;
  width: 100%;
}

& button.unstyled.client-section-header:hover {
  background-color: var(--light-gray);
}

& .client-section-content {
  padding: 1.6rem 3.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

& button.icon {
  margin-left: 1.6rem;
}

& .edit-button {
  margin-top: 1.6rem;
}

& .audit-info {
  font-style: italic;
  font-size: 1.2rem;
  text-align: center;
}

& table.client-table {
  width: 100%;
  table-layout: fixed;
}

& table.client-table td:first-child {
  text-align: right;
  padding-right: 1.2rem;
  width: 50%;
  max-width: 50%;
}

& table.client-table td:last-child {
  padding-left: 1.2rem;
}

& table.client-table tr:not(:first-child) td {
  padding-top: .4rem;
}

& table.client-table tr:not(:last-child) td {
  padding-bottom: .4rem;
}

${addClientCss}
`;
