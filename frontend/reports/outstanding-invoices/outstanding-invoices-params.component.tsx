import React from "react";
import { Link } from "@reach/router";
import DatePresetInputs from "../shared/date-preset-inputs.component";
import { useForceUpdate } from "../../util/use-force-update";

export default function OutstandingInvoicesParams(props) {
  return (
    <>
      <div className="report-input">
        The date parameters refer to the Invoice Date.
      </div>
      <DatePresetInputs forceUpdate={useForceUpdate()} />
      <div className="actions">
        <Link
          className="primary button"
          to={`${window.location.pathname}/results${window.location.search}`}
        >
          Run report
        </Link>
      </div>
    </>
  );
}
