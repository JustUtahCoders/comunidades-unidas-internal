import React from "react";
import { useCss } from "kremling";
import { css as addClientCss } from "../add-client/add-client.component";

export default function ClientSection(props: ClientSectionProps) {
  const [expanded, setExpanded] = React.useState(true);
  const scope = useCss(css);

  return (
    <div className="card padding-0" {...scope}>
      <button
        className="unstyled client-section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h3>{props.title}</h3>
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
};

const css = `
& button.unstyled.client-section-header {
  padding: 1.6rem 3.2rem;
  width: 100%;
}

& button.unstyled.client-section-header:hover {
  background-color: var(--very-light-gray);
}

& .client-section-content {
  padding: 1.6rem 3.2rem;
}

& button.icon {
  margin-left: 1.6rem;
}

& .edit-button {
  margin-top: 1.6rem;
}

${addClientCss}
`;
