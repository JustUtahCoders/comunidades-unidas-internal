import React from "react";
import { Link } from "@reach/router";
import { useQueryParamState } from "../../util/use-query-param-state.hook";

export default function InteractionsByServiceParams(props) {
  const [startDate, setStartDate] = useQueryParamState("start", "");

  const [endDate, setEndDate] = useQueryParamState("end", "");

  return (
    <>
      <div className="report-input">
        <label id="start-date">Start date:</label>
        <input
          type="date"
          value={startDate}
          onChange={evt => setStartDate(evt.target.value)}
          aria-labelledby="start-date"
        />
      </div>
      <div className="report-input">
        <label id="end-date">End date:</label>
        <input
          type="date"
          value={endDate}
          onChange={evt => setEndDate(evt.target.value)}
          aria-labelledby="end-date"
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
