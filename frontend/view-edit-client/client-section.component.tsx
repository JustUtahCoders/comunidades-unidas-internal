import React from "react";
import { useCss } from "kremling";

export default function ClientSection(props: ClientSectionProps) {
  const [expanded, setExpanded] = React.useState(true);
  const scope = useCss(css);

  return (
    <div className="card padding-0" {...scope}>
      <button
        className="unstyled client-section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h4>{props.title}</h4>
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
  padding: 16rem 32rem;
  width: 100%;
}

& button.unstyled.client-section-header:hover {
  background-color: var(--very-light-gray);
}

& .client-section-content {
  padding: 16rem 32rem;
}
`;
