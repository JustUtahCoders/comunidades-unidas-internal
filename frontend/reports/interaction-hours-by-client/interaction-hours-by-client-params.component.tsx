import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";

const sixHoursInSeconds = 21600;

export default function InteractionHoursByClientParams(props) {
  const [minInteractionSeconds, setMinInteractionSeconds] = useQueryParamState(
    "minInteractionSeconds",
    sixHoursInSeconds.toString()
  );

  return (
    <>
      <div className="report-input">
        <label id="min-hours-label">Minimum # of interaction hours:</label>
        <input
          type="number"
          value={Number(minInteractionSeconds) / 3600}
          onChange={evt =>
            setMinInteractionSeconds(String(Number(evt.target.value) * 3600))
          }
          aria-labelledby="min-hours-label"
        />
      </div>
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
