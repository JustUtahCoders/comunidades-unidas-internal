import React, { useState } from "react";
import user2Url from "../../icons/148705-essential-collection/svg/user-2.svg";
import { StepComponentProps, Step } from "./add-client.component";

export default function CheckDuplicate(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("1990-01-01");
  const [duplicates, setDuplicates] = useState("");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={user2Url} className="hint-icon" />
        </div>
        <div className="instruction">
          Let's first check if this person already exists in Tracker.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>First Name</span>
            <input
              type="text"
              value={firstName}
              onChange={evt => setFirstName(evt.target.value)}
              required
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
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>Birthday</span>
            <input
              type="date"
              value={birthday}
              onChange={evt => setBirthday(evt.target.value)}
              required
            />
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            <span>Check client</span>
          </button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    //Fetch duplicates
    fetch("/api/duplicate-check/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        birthday: birthday
      })
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad Response from server");
        }
        return response.json();
      })
      .then(function(data) {
        //console.log(data);
        if (data.length > 0) {
          //console.log("duplicates found", data);
          setDuplicates(JSON.stringify(data));
          props.nextStep(Step.LIST_DUPLICATES, {
            firstName,
            lastName,
            birthday,
            duplicates
          });
        } else {
          props.nextStep(Step.PERSONAL_INFORMATION, {
            firstName,
            lastName,
            birthday
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
