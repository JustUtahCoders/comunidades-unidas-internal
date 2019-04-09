import React from "react";
import usersUrl from "../../icons/148705-essential-collection/svg/users-1.svg";
import { Step, DuplicateWarning, ClientState } from "./add-client.component";

type ListDuplicatesProps = {
  duplicateWarning: DuplicateWarning,
  goBack(): void,
  continueAnyway(clientState: ClientState): void,
}

export default function ListDuplicates(props: ListDuplicatesProps) {
  const duplicates = props.duplicateWarning.duplicates;
  const firstName = props.duplicateWarning.firstName;
  const lastName = props.duplicateWarning.lastName;
  const birthday = props.duplicateWarning.birthDate;

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={usersUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          The database has records matching {props.duplicateWarning.firstName}&nbsp;
          {props.duplicateWarning.lastName}
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} autoComplete="off">
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
                <tr key={duplicate.personId}>
                  <td>{duplicate.firstName} </td>
                  <td>{duplicate.lastName}</td>
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
              onClick={props.goBack}
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

  function handleSubmit(evt) {
    evt.preventDefault();

    props.continueAnyway({
      firstName,
      lastName,
      birthday
    });
  }
}