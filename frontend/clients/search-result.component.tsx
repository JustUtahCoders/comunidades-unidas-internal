import React, { useState } from "react";
import { useCss } from "kremling";
import searchResultUrl from "../../icons/148705-essential-collection/svg/list.svg";
import { StepComponentProps, Step } from "./view-clients.component";
import dateformat from "dateformat";

export default function SearchResult(props: StepComponentProps) {
  const scope = useCss(css);
  return (
    <>
      <div className="list-duplicates" {...scope}>
        <div className="hints-and-instructions">
          <div>
            <img src={searchResultUrl} className="hint-icon" />
          </div>
          <div className="instruction">
            Search results for {props.clientState.firstName}{" "}
            {props.clientState.lastName} {props.clientState.zip}
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <table>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Date of Birth</th>
                  <th>ZIP</th>
                  <th>Phone Number</th>
                  <th>Added By</th>
                  <th>Added Date</th>
                </tr>
              </thead>
            </table>
            <div className="actions">
              <button type="button" className="secondary" onClick={props.reset}>
                new Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  function handleSubmit(evt) {
    evt.preventDefault();
    console.log("bar");
  }
}

const css = `
& .list-duplicates {
  margin: 0 auto;
}

& table th {
  padding: 8rem;
}

& table td {
  text-align: center;
  vertical-align: middle;
  padding: 8rem;
}
`;
