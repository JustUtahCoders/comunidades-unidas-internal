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

  const [startDate, setStartDate] = useQueryParamState("start", "");
  const [endDate, setEndDate] = useQueryParamState("end", "");

  return (
    <>
      <div className="report-input">
        <label htmlFor="min-hours">Minimum # of interaction hours:</label>
        <input
          id="min-hours"
          type="number"
          step=".1"
          value={Number(minInteractionSeconds) / 3600}
          onChange={(evt) =>
            setMinInteractionSeconds(
              String(Math.round(Number(evt.target.value) * 3600))
            )
          }
        />
      </div>
      <div className="report-input">
        <label htmlFor="max-hours">Maximum # of interaction hours:</label>
        <input
          id="max-hours"
          type="number"
          step=".1"
          value={Number(maxInteractionsSeconds) / 3600}
          onChange={(evt) =>
            setMaxInteractionSeconds(
              String(Math.round(Number(evt.target.value) * 3600))
            )
          }
        />
      </div>
      <div className="report-input">
        <label htmlFor="start-date">Start date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(evt) => setStartDate(evt.target.value)}
        />
      </div>
      <div className="report-input">
        <label htmlFor="end-date">End date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(evt) => setEndDate(evt.target.value)}
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
