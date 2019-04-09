import React, { useState } from "react";
import user2Url from "../../icons/148705-essential-collection/svg/user-2.svg";
import { StepComponentProps, Step } from "./add-client.component";

export default function CheckDuplicate(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("1990-01-01");
  const [gender, setGender] = useState("female");
  const [otherGender, setOtherGender] = useState("");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={user2Url} className="hint-icon" />
        </div>
        <div className="instruction">
          Let's first check if this person already exists in the database.
        </div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            <span>First Name</span>
            <input
              type="text"
              value={firstName}
              onChange={evt => setFirstName(evt.target.value)}
              required
              autoComplete="off"
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
        <div>
          <label>
            <span>Gender</span>
            <select
              value={gender}
              onChange={evt => setGender(evt.target.value)}
              autoComplete="off"
              required
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {gender === "other" && (
          <div>
            <label>
              <span>Other gender</span>
              <input
                type="text"
                value={otherGender}
                onChange={evt => setOtherGender(evt.target.value)}
                required
              />
            </label>
          </div>
        )}
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
    /*I added this fetch to query data for potential duplicates, if there is result then the the LIST_DUPLICATES component is next.. I am not sure if this is the right way to do it however.  */
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
      .then(function(duplicates) {
        if (duplicates.length > 0) {
          props.showDuplicateWarning({
            firstName,
            lastName,
            birthday,
            gender: gender === "other" ? otherGender : gender,
            duplicates
          });
        } else {
          props.nextStep(Step.CONTACT_INFORMATION, {
            firstName,
            lastName,
            gender: gender === "other" ? otherGender : gender,
            birthday
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
