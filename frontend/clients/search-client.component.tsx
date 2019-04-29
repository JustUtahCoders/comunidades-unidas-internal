import React, { useState } from "react";
import searchUrl from "../../icons/148705-essential-collection/svg/search.svg";
import { StepComponentProps, Step } from "./view-clients.component";

export default function SearchClient(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  const [searchResult, setSearchResult] = useState();
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={searchUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Search for client by name or by zipcode or both. You can enter parital
          first name and partial last name.
        </div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            <span>First Name</span>
            <input
              type="text"
              autoComplete="off"
              value={firstName}
              onChange={evt => setFirstName(evt.target.value)}
              autoFocus
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>Last Name</span>
            <input
              type="text"
              value={lastName}
              onChange={evt => setLastName(evt.target.value)}
              autoComplete="off"
              autoFocus
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>Zip Code</span>
            <input
              type="text"
              value={zip}
              onChange={evt => setZip(evt.target.value)}
              autoComplete="off"
              autoFocus
              required
            />
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            <span>Search</span>
          </button>
        </div>
      </form>
    </>
  );
  function handleSubmit(evt) {
    evt.preventDefault();
    console.log("foo");
    props.nextStep(Step.SEARCH_RESULT, {
      firstName,
      lastName,
      zip,
      searchResult
    });
  }
}
