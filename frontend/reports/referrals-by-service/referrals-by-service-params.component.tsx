import React from "react";
import { Link } from "@reach/router";
import { useQueryParamState } from "../../util/use-query-param-state.hook";

export default function ReferralsByServiceParams(props) {
  const [startDate, setStartDate] = useQueryParamState("start", "");
  const [endDate, setEndDate] = useQueryParamState("end", "");

  return (
    <>
      <div className="report-input">
        The date parameters refer to the Referral Date.
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
