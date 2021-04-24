import React from "react";
import { Link } from "@reach/router";
import DatePresetInputs from "../shared/date-preset-inputs.component";
import { useForceUpdate } from "../../util/use-force-update";

export default function ServiceInterestsParams(props) {
  return (
    <>
      <div className="report-input">
        For clients, the intake date is used for this report. For leads, the
        signup date is used.
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
