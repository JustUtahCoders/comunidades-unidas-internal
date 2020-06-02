import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";
import {
  secondsToHours,
  secondsToRemainderMinutes,
} from "../../util/time-duration-helpers";

const sixHoursInSeconds = 21600;
const tenHoursInSeconds = 10 * 60 * 60;

export default function InteractionHoursByClientParams(props) {
  const [minInteractionSeconds, setMinInteractionSeconds] = useQueryParamState(
    "minInteractionSeconds"
  );
  const [minInclusive, setMinInclusive] = useQueryParamState(
    "minInclusive",
    "false"
  );

  const [maxInteractionsSeconds, setMaxInteractionSeconds] = useQueryParamState(
    "maxInteractionSeconds"
  );
  const [maxInclusive, setMaxInclusive] = useQueryParamState(
    "maxInclusive",
    "false"
  );

  const [startDate, setStartDate] = useQueryParamState("start", "");
  const [endDate, setEndDate] = useQueryParamState("end", "");

  const hasMinSeconds = (minInteractionSeconds as string).trim().length > 0;
  const hasMaxSeconds = (maxInteractionsSeconds as string).trim().length > 0;

  const minHours = secondsToHours(Number(minInteractionSeconds));
  const minMinutes = secondsToRemainderMinutes(Number(minInteractionSeconds));

  const maxHours = secondsToHours(Number(maxInteractionsSeconds));
  const maxMinutes = secondsToRemainderMinutes(Number(maxInteractionsSeconds));

  return (
    <>
      <div className="report-input">
        <label>Set minimum interaction hours?</label>
        <input
          id="min-hours-none"
          type="radio"
          name="min-hours"
          checked={!hasMinSeconds}
          onChange={() => setMinInteractionSeconds("")}
        />
        <label htmlFor="min-hours-none">No</label>
        <input
          id="min-hours-set"
          type="radio"
          name="min-hours"
          checked={hasMinSeconds}
          onChange={() => setMinInteractionSeconds(String(sixHoursInSeconds))}
        />
        <label htmlFor="min-hours-set">Yes</label>
      </div>
      {hasMinSeconds && (
        <>
          <div className="report-input indent">
            <input
              id="min-inclusive"
              type="radio"
              name="min-inclusive"
              checked={minInclusive === "true"}
              onChange={() => setMinInclusive("true")}
            />
            <label htmlFor="min-inclusive">At least</label>
            <input
              id="min-exclusive"
              type="radio"
              name="min-inclusive"
              checked={minInclusive !== "true"}
              onChange={() => setMinInclusive("false")}
            />
            <label htmlFor="min-exclusive">More than</label>
          </div>
          <div className="report-input indent">
            <label htmlFor="min-hours">Hours</label>
            <input
              id="min-hours"
              type="number"
              step="1"
              value={minHours}
              onChange={(evt) =>
                setMinInteractionSeconds(
                  String(
                    Math.round(Number(evt.target.value) * 3600) +
                      minMinutes * 60
                  )
                )
              }
            />
            <label htmlFor="min-hours" style={{ marginLeft: "2.4rem" }}>
              Minutes
            </label>
            <input
              id="min-hours"
              type="number"
              step="1"
              value={minMinutes}
              onChange={(evt) =>
                setMinInteractionSeconds(
                  String(minHours * 3600 + Number(evt.target.value) * 60)
                )
              }
            />
          </div>
        </>
      )}
      <div className="report-input">
        <label>Set maximum interaction hours?</label>
        <input
          id="max-hours-none"
          type="radio"
          name="max-hours"
          checked={!hasMaxSeconds}
          onChange={() => setMaxInteractionSeconds("")}
        />
        <label htmlFor="max-hours-none">No</label>
        <input
          id="max-hours-set"
          type="radio"
          name="max-hours"
          checked={hasMaxSeconds}
          onChange={() => setMaxInteractionSeconds(String(tenHoursInSeconds))}
        />
        <label htmlFor="max-hours-set">Yes</label>
      </div>
      {hasMaxSeconds && (
        <>
          <div className="report-input indent">
            <input
              id="max-inclusive"
              type="radio"
              name="max-inclusive"
              checked={maxInclusive === "true"}
              onChange={() => setMaxInclusive("true")}
            />
            <label htmlFor="max-inclusive">At most</label>
            <input
              id="max-exclusive"
              type="radio"
              name="max-inclusive"
              checked={maxInclusive !== "true"}
              onChange={() => setMaxInclusive("false")}
            />
            <label htmlFor="max-exclusive">Less than</label>
          </div>
          <div className="report-input indent">
            <label htmlFor="max-hours">Hours:</label>
            <input
              id="max-hours"
              type="number"
              step="1"
              value={maxHours}
              onChange={(evt) =>
                setMaxInteractionSeconds(
                  String(
                    Math.round(Number(evt.target.value) * 3600) +
                      maxMinutes * 60
                  )
                )
              }
            />
            <label htmlFor="max-hours" style={{ marginLeft: "2.4rem" }}>
              Minutes
            </label>
            <input
              id="max-hours"
              type="number"
              step="1"
              value={maxMinutes}
              onChange={(evt) =>
                setMaxInteractionSeconds(
                  String(maxHours * 3600 + Number(evt.target.value) * 60)
                )
              }
            />
          </div>
        </>
      )}
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
