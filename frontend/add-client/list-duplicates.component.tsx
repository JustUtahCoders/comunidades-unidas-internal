import React from "react";
import usersUrl from "../../icons/148705-essential-collection/svg/users-1.svg";
import { DuplicateWarning, ClientState } from "./add-client.component";
import { useCss } from "kremling";
import dateformat from "dateformat";
import { Link } from "@reach/router";

type ListDuplicatesProps = {
  duplicateWarning: DuplicateWarning;
  goBack(): void;
  continueAnyway(clientState: ClientState): void;
};

export default function ListDuplicates(props: ListDuplicatesProps) {
  const firstName = props.duplicateWarning.firstName;
  const lastName = props.duplicateWarning.lastName;
  const birthday = props.duplicateWarning.birthday;
  const gender = props.duplicateWarning.gender;
  const scope = useCss(css);

  return (
    <div className="list-duplicates" {...scope}>
      <div className="hints-and-instructions">
        <div>
          <img src={usersUrl} className="hint-icon" alt="Duplicate users" />
        </div>
        <div className="instruction">
          The database has records matching {props.duplicateWarning.firstName}
          &nbsp;
          {props.duplicateWarning.lastName}
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} autoComplete="new-password">
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
              {props.duplicateWarning.possibleLeadSources.map(leadSource => (
                <tr key={leadSource.id} className="lead-row">
                  <td>{leadSource.firstName} </td>
                  <td>{leadSource.lastName}</td>
                  <td>&mdash;</td>
                  <td>{leadSource.gender}</td>
                  <td>
                    <button
                      type="button"
                      className="primary button"
                      onClick={() => convertLead(leadSource)}
                    >
                      Convert Lead
                    </button>
                  </td>
                </tr>
              ))}
              {props.duplicateWarning.duplicates.map(duplicate => (
                <tr key={duplicate.id} className="client-row">
                  <td>{duplicate.firstName} </td>
                  <td>{duplicate.lastName}</td>
                  <td>
                    {dateformat(new Date(duplicate.birthday), "m-d-yyyy")}
                  </td>
                  <td>{duplicate.gender}</td>
                  <td>
                    <Link
                      className="primary button"
                      to={`/clients/${duplicate.id}`}
                    >
                      Update Client
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <button type="button" className="secondary" onClick={props.goBack}>
              Go back
            </button>
            <button type="submit" className="primary">
              <span>Next: Not a Duplicate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function handleSubmit(evt) {
    evt.preventDefault();

    props.continueAnyway({
      firstName,
      lastName,
      birthday,
      gender
    });
  }

  function convertLead(leadSource) {
    props.continueAnyway({
      firstName,
      lastName,
      birthday,
      gender,
      leadId: leadSource.id
    });
  }
}

const css = `
& .list-duplicates {
  margin: 0 auto;
}

& table {
  border-collapse: collapse;
}

& table th, & table td {
  padding: 1.6rem .8rem;
  border: .1rem solid black;
}

& table td {
  text-align: center;
  vertical-align: middle;
}

& .client-row {
  background-color: navajowhite;
}

& .lead-row {
  background-color: lightblue;
}
`;
