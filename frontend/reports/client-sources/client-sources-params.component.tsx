import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";

export default function ClientSourcesParams(props) {
  const [startDate, setStartDate] = useQueryParamState("start", "");
  const [endDate, setEndDate] = useQueryParamState("end", "");

  return (
    <>
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
