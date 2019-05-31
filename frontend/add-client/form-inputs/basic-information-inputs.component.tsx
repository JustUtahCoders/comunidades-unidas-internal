import React from "react";

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
  const [gender, setGender] = React.useState(() =>
    getInitialGender(props.client.gender)
  );
  const [otherGender, setOtherGender] = React.useState(() =>
    getInitialOtherGender(props.client.gender)
  );

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div>
        <label>
          <span>First Name</span>
          <input
            type="text"
            value={firstName}
            onChange={evt => setFirstName(evt.target.value)}
            required
            autoComplete="new-password"
            autoCapitalize="words"
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
            autoComplete="new-password"
            autoCapitalize="words"
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
            autoComplete="new-password"
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
      {props.children}
    </form>
  );

  function handleSubmit(evt) {
    return props.handleSubmit(evt, {
      firstName,
      lastName,
      gender: gender === "other" ? otherGender : gender,
      birthday
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

const genderOptions = {
  female: "Female",
  male: "Male",
  nonbinary: "Nonbinary",
  other: "Other"
};

function getInitialGender(val) {
  if (val) {
    return Object.keys(genderOptions).includes(val) ? val : "other";
  } else {
    return "female";
  }
}

function getInitialOtherGender(val) {
  if (val) {
    return Object.keys(genderOptions).includes(val) ? "" : val;
  } else {
    return "";
  }
}
