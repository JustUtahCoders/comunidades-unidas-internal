import React, { useState } from "react";
import usersUrl from "../../icons/148705-essential-collection/svg/users-1.svg";
import { StepComponentProps, Step } from "./add-client.component";

export default function ListDuplicates(props: StepComponentProps) {
  const duplicates = props.clientState.duplicates;
  const firstName = props.clientState.firstName;
  const lastName = props.clientState.lastName;
  const birthday = props.clientState.birthday;
  /*Here, do we have to send a request to API for duplicates again using matching first and last name or is there a way to carry over the duplicate array/result from last state?*/
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={usersUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          The database has records matching {props.clientState.firstName}&nbsp;
          {props.clientState.lastName}
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {duplicates.map(duplicate => (
                <tr key={duplicate.personid}>
                  <td>{duplicate.firstname} </td>
                  <td>{duplicate.lastname}</td>
                  <td>{duplicate.birthDate}</td>
                  <td>{duplicate.gender}</td>
                  <td>
                    <button type="button" className="primary">
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => props.goBack(Step.CHECK_DUPLICATE)}
            >
              Go back
            </button>
            <button type="submit" className="primary">
              <span>Next: Not a Duplicate</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
  //Select a duplicate and edit, start over or continue with client
  function handleSubmit(evt) {
    evt.preventDefault();
    //I am not a huge fan of browser confirm. Update this later?
    confirm(
      `Adding duplicates can cause poor data quality. Are you sure ${firstName} ${lastName} is not a duplicate?`
    );
    props.nextStep(Step.PERSONAL_INFORMATION, {
      firstName,
      lastName,
      birthday
    });
  }
}
