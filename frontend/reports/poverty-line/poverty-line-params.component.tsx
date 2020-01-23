import React from "react";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { Link } from "@reach/router";

export default function PovertyLineParams(props) {
  const [year, setYear] = useQueryParamState("year", "2020");

  return (
    <>
      <div className="report-input">
        <label id="year-label">Federal Poverty Line Year:</label>
        <select value={year} onChange={evt => setYear(evt.target.value)}>
          <option>2019</option>
          <option>2020</option>
        </select>
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
