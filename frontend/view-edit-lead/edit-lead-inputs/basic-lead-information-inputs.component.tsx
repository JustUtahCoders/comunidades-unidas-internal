import React from "react";
import { capitalize } from "lodash-es";

export default function BasicLeadInformationInputs(
  props: BasicLeadInformationInputsProps
) {
  const [firstName, setFirstName] = React.useState(props.lead.firstName || "");
  const [lastName, setLastName] = React.useState(props.lead.lastName || "");
  const [gender, setGender] = React.useState(props.lead.gender || "female");
  const [age, setAge] = React.useState(props.lead.age);
  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="edit-form">
      <div>
        <label>
          <span>First Name</span>
          <input
            type="text"
            value={firstName}
            onChange={evt => setFirstName(evt.target.value)}
            autoComplete="new-password"
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
            autoComplete="new-password"
            autoFocus
            required
          />
        </label>
      </div>
      <div>
        <label>
          <span>Age</span>
          <input
            type="number"
            name="age"
            value={age}
            onChange={evt => setAge(parseInt(evt.target.value))}
            autoComplete="new-password"
            autoFocus
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
            autoComplete="new-password"
            required
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="transgender">Transgender</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <div className="children-container">{props.children}</div>
    </form>
  );

  function handleSubmit(evt) {
    return props.handleSubmit(evt, {
      firstName: capitalize(firstName.trim()),
      lastName: capitalize(lastName.trim()),
      gender,
      age
    });
  }
}

type BasicLeadInformationInputsProps = {
  lead: BasicInfoLead;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: BasicInfoLead);
};

type BasicInfoLead = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number;
};
