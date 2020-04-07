import React from "react";
import { Link } from "@reach/router";
import { useCss } from "kremling";

export default function ConvertToClientCard(props) {
  const scope = useCss(css);

  return (
    <div {...scope} className="convert-to-client">
      <Link
        className="button primary"
        to={`/leads/${props.lead.id}/convert-to-client`}
      >
        Convert to client
      </Link>
    </div>
  );
}

const css = `
& .convert-to-client {
  display: flex;
  justify-content: center;
  margin: 3.2rem 0;
}
`;
