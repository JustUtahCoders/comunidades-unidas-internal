import React, { useState } from "react";
import searchUrl from "../../icons/148705-essential-collection/svg/search.svg";
import { StepComponentProps, Step } from "./view-clients.component";
import easyFetch from "../util/easy-fetch";

export default function SearchClient(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={searchUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Search for client by name or by zipcode or both. You can enter parital
          first name and partial last name or simply do a blank search.
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
    console.log(firstName);

    easyFetch(
      `/api/clients?firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}&zip=${encodeURIComponent(
        zip
      )}`
    )
      .then(function(data) {
        if (data.clients.length > 0) {
          props.nextStep(Step.SEARCH_RESULT, {
            firstName,
            lastName,
            zip,
            searchResult: data.clients
          });
        } else {
          console.log("No data");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
