import React from "react";
import { capitalize } from "lodash-es";
import { ClientIntakeSettings } from "../../admin/intake/client-intake-settings.component";
import {
  QuestionRendererMap,
  renderDynamicallyOrderedQuestions,
} from "./dynamic-question-helpers";
import { IntakeQuestion } from "../../admin/intake/intake-setting.component";

export default function BasicInformationInputs(
  props: BasicInformationInputsProps
) {
  const [firstName, setFirstName] = React.useState(
    props.client.firstName || ""
  );
  const [lastName, setLastName] = React.useState(props.client.lastName || "");
  const [birthday, setBirthday] = React.useState(props.client.birthday || "");
  const [gender, setGender] = React.useState(
    props.client.gender || (props.isNewClient ? "female" : "unknown")
  );

  const questionRenderers: QuestionRendererMap = {
    firstName: renderFirstName,
    lastName: renderLastName,
    birthday: renderBirthday,
    gender: renderGender,
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {renderDynamicallyOrderedQuestions(
        props.clientIntakeSettings.basicInfo,
        questionRenderers
      )}
      {props.children}
    </form>
  );

  function renderFirstName(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="text"
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}
            placeholder={question.placeholder || ""}
            required={question.required}
            autoComplete="new-password"
            autoFocus
          />
        </label>
      </div>
    );
  }

  function renderLastName(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="text"
            value={lastName}
            onChange={(evt) => setLastName(evt.target.value)}
            placeholder={question.placeholder || ""}
            autoComplete="new-password"
            required={question.required}
          />
        </label>
      </div>
    );
  }

  function renderBirthday(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="date"
            value={birthday}
            placeholder={question.placeholder || ""}
            onChange={(evt) => setBirthday(evt.target.value)}
            required={question.required && props.client.birthday !== null}
          />
        </label>
      </div>
    );
  }

  function renderGender(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            value={gender || "unknown"}
            onChange={(evt) => setGender(evt.target.value)}
            autoComplete="new-password"
            required={question.required}
            placeholder={question.placeholder || ""}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="transgender">Transgender</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    );
  }

  function handleSubmit(evt) {
    return props.handleSubmit(evt, {
      firstName: capitalize(firstName.trim()),
      lastName: capitalize(lastName.trim()),
      gender: gender === "unknown" ? null : gender,
      birthday: birthday === "" ? null : birthday,
    });
  }
}

type BasicInformationInputsProps = {
  client: BasicInfoClient;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: BasicInfoClient);
  isNewClient: boolean;
  clientIntakeSettings: ClientIntakeSettings;
};

type BasicInfoClient = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthday?: string;
};
