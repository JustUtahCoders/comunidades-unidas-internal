import React, { useState } from "react";
import usersUrl from "../../icons/148705-essential-collection/svg/users-1.svg";
import { StepComponentProps, Step } from "./add-client.component";

export default function ListDuplicates(props: StepComponentProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("1990-01-01");
  /*Here, do we have to send a request to API for duplicates again using matching first and last name or is there a way to carry over the duplicate array/result from last state?*/
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={usersUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          The database has records matching {props.clientState.firstName}
          {props.clientState.lastName}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>First Name</span>
            <input />
          </label>
        </div>
      </form>
    </>
  );
  //Select a duplicate or start over
  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.PERSONAL_INFORMATION, {});
  }
}
