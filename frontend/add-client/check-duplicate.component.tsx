import React, { useState } from "react";
import user2Url from "../../icons/148705-essential-collection/svg/user-2.svg";
import { StepComponentProps, Step } from "./add-client.component";
import easyFetch from "../util/easy-fetch";

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

    easyFetch(
      `/api/client-duplicates?firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}&gender=${encodeURIComponent(
        gender
      )}&dob=${encodeURIComponent(birthday)}`
    )
      .then(function(data) {
        if (data.clientDuplicates.length > 0) {
          props.showDuplicateWarning({
            firstName,
            lastName,
            birthday,
            gender: gender === "other" ? otherGender : gender,
            duplicates: data.clientDuplicates
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
