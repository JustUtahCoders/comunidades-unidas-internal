import React, { useState } from "react";
import user2Url from "../../icons/148705-essential-collection/svg/user-2.svg";
import { StepComponentProps, Step } from "./add-client.component";
import { setConstantValue } from "typescript";

export default function CheckDuplicate(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("1990-01-01");
  const [gender, setGender] = useState("female");
  const [genderExplanation, setGenderExplanation] = useState("");

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
        <div>
          <label>
            <span>Gender</span>
            <select
              value={gender}
              onChange={evt => setGender(evt.target.value)}
              required
              autoFocus
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="transgender">Transgender</option>
              <option value="other">Other (please explain)</option>
            </select>
          </label>
        </div>
        {gender === "other" && (
          <div>
            <label>
              <span>Explanation</span>
              <textarea
                value={genderExplanation}
                onChange={evt => setGenderExplanation(evt.target.value)}
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
          props.nextStep(Step.LIST_DUPLICATES, {
            firstName,
            lastName,
            birthday,
            gender: gender === "other" ? genderExplanation : gender,
            duplicates
          });
        } else {
          props.nextStep(Step.ADD_CONTACT, {
            firstName,
            lastName,
            gender: gender === "other" ? genderExplanation : gender,
            birthday
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
export enum Gender {
  FEMALE = "female",
  MALE = "male",
  TRANSGENDER = "transgender",
  OTHER = "other"
}
