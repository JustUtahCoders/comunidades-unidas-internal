import React from "react";
import { Link } from "@reach/router";

export default function AgesParams(props) {
  return (
    <div className="actions">
      <Link
        className="primary button"
        to={`${window.location.pathname}/results${window.location.search}`}
      >
        Run report
      </Link>
    </div>
  );
}
