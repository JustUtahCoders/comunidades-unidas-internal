import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";

const sixHoursInSeconds = 21600;
const tenThousandHoursInSeconds = 10000 * 60 * 60;

export default function InteractionHoursByClientParams(props) {
  const [minInteractionSeconds, setMinInteractionSeconds] = useQueryParamState(
    "minInteractionSeconds",
    sixHoursInSeconds.toString()
  );

  const [maxInteractionsSeconds, setMaxInteractionSeconds] = useQueryParamState(
    "maxInteractionSeconds",
    tenThousandHoursInSeconds.toString()
  );

  return (
    <>
      <div className="report-input">
        <label id="min-hours-label">Minimum # of interaction hours:</label>
        <input
          type="number"
          step=".1"
          value={Number(minInteractionSeconds) / 3600}
          onChange={evt =>
            setMinInteractionSeconds(
              String(Math.round(Number(evt.target.value) * 3600))
            )
          }
          aria-labelledby="min-hours-label"
        />
      </div>
      <div className="report-input">
        <label id="max-hours-label">Maximum # of interaction hours:</label>
        <input
          type="number"
          step=".1"
          value={Number(maxInteractionsSeconds) / 3600}
          onChange={evt =>
            setMaxInteractionSeconds(
              String(Math.round(Number(evt.target.value) * 3600))
            )
          }
          aria-labelledby="max-hours-label"
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
