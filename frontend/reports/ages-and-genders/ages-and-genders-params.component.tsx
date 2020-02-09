import React from "react";
import { Link } from "@reach/router";

export default function AgesAndGendersParams(props) {
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
