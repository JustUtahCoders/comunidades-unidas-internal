import React from "react";
import { capitalize } from "lodash-es";

export default function BasicInformationInputs(
  props: BasicInformationInputsProps
) {
  const [firstName, setFirstName] = React.useState(
    props.client.firstName || ""
  );
  const [lastName, setLastName] = React.useState(props.client.lastName || "");
  const [birthday, setBirthday] = React.useState(
    props.client.birthday || "1990-01-01"
  );
  const [gender, setGender] = React.useState(props.client.gender || "female");

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div>
        <label>
          <span>First Name</span>
          <input
            type="text"
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}
            required
            autoComplete="new-password"
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
            onChange={(evt) => setLastName(evt.target.value)}
            autoComplete="new-password"
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
            onChange={(evt) => setBirthday(evt.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <span>Gender</span>
          <select
            value={gender}
            onChange={(evt) => setGender(evt.target.value)}
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
      {props.children}
    </form>
  );

  function handleSubmit(evt) {
    return props.handleSubmit(evt, {
      firstName: capitalize(firstName.trim()),
      lastName: capitalize(lastName.trim()),
      gender,
      birthday,
    });
  }
}

type BasicInformationInputsProps = {
  client: BasicInfoClient;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: BasicInfoClient);
};

type BasicInfoClient = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthday?: string;
};
