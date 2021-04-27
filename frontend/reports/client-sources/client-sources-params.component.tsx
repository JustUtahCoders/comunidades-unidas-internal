import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";
import DatePresetInputs from "../shared/date-preset-inputs.component";
import { useForceUpdate } from "../../util/use-force-update";

export default function ClientSourcesParams(props) {
  return (
    <>
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
