import React, { FormEvent } from "react";
import dateFormat from "dateformat";
import PhoneInput from "../../util/phone-input.component";
import StateSelect from "../../util/state-select.component";
import CityInput from "../../util/city-input.component";
import { capitalize, isEmpty } from "lodash-es";
import emailValidator from "email-validator";
import { renderDynamicallyOrderedQuestions } from "./dynamic-question-helpers";
import { ClientIntakeSettings } from "../../admin/intake/client-intake-settings.component";
import { IntakeQuestion } from "../../admin/intake/intake-setting.component";

export default React.forwardRef(function ContactInformationInputs(
  props: ContactInformationInputsProps,
  ref
) {
  const [phone, setPhone] = React.useState(props.client.phone || "");
  const [smsConsent, setSmsConsent] = React.useState(
    props.client.smsConsent || false
  );
  const [streetAddress, setStreetAddress] = React.useState(
    props.client.streetAddress || ""
  );
  const [city, setCity] = React.useState(props.client.city || "");
  const [state, setState] = React.useState(
    props.client.state || (props.isNewClient ? "UT" : "")
  );
  const [zip, setZip] = React.useState(props.client.zip || "");
  const [housing, setHousing] = React.useState(
    props.client.housing || (props.isNewClient ? "renter" : "")
  );
  const [email, setEmail] = React.useState(props.client.email || "");
  const emailRef = React.useRef<HTMLInputElement>();
  const [dateOfIntake, setDateOfIntake] = React.useState(
    props.client.dateOfIntake || getTodayAsString
  );

  const zipRef = React.useRef(null);

  React.useEffect(() => {
    if (
      emailRef.current &&
      email.trim().length > 0 &&
      !emailValidator.validate(email)
    ) {
      emailRef.current.setCustomValidity(
        "Please provide a valid email address"
      );
    } else {
      emailRef.current.setCustomValidity("");
    }
  });

  React.useEffect(() => {
    // @ts-ignore
    ref.current = {
      getData,
    };
  });

  const questionRenderers = {
    dateOfIntake: renderDateOfIntake,
    phone: renderPhone,
    smsConsent: renderSmsConsent,
    "homeAddress.city": renderCity,
    "homeAddress.street": renderStreet,
    "homeAddress.zip": renderZip,
    "homeAddress.state": renderState,
    email: renderEmail,
    housingStatus: renderHousingStatus,
  };

  return (
    <form onSubmit={props.handleSubmit} autoComplete="new-password">
      {renderDynamicallyOrderedQuestions(
        props.clientIntakeSettings.contactInfo,
        questionRenderers
      )}
      {props.children}
    </form>
  );

  function renderSmsConsent(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="checkbox"
            name="smsConsent"
            checked={smsConsent}
            onChange={(evt) => setSmsConsent(Boolean(evt.target.checked))}
            className="checkbox"
          />
        </label>
      </div>
    );
  }

  function renderEmail(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            ref={emailRef}
            type="email"
            value={email}
            placeholder={question.placeholder || ""}
            required={question.required}
            onChange={(evt) => setEmail(evt.target.value)}
            autoComplete="new-password"
          />
        </label>
      </div>
    );
  }

  function renderStreet(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="text"
            value={streetAddress}
            onChange={(evt) => setStreetAddress(evt.target.value)}
            required={question.required && props.isNewClient}
            placeholder={question.placeholder}
            autoComplete="new-password"
          />
        </label>
      </div>
    );
  }

  function renderCity(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <CityInput
            state={state}
            city={city}
            setCity={setCity}
            nextInputRef={zipRef}
            placeholder={question.placeholder}
            required={question.required && props.isNewClient}
          />
        </label>
      </div>
    );
  }

  function renderState(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <StateSelect
            state={state}
            setState={setState}
            required={question.required}
            placeholder={question.placeholder}
          />
        </label>
      </div>
    );
  }

  function renderZip(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            ref={zipRef}
            type="text"
            minLength={5}
            value={zip}
            onChange={(evt) => setZip(evt.target.value)}
            autoComplete="new-password"
            placeholder={question.placeholder || ""}
            required={question.required && props.isNewClient}
          />
        </label>
      </div>
    );
  }

  function renderHousingStatus(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            value={housing || "unknown"}
            name="housing"
            onChange={(evt) => setHousing(evt.target.value)}
            required={question.required}
            placeholder={question.placeholder || ""}
          >
            {Object.keys(HousingStatuses).map((key) => (
              <option value={key} key={key}>
                {HousingStatuses[key]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function renderPhone(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <PhoneInput
            phone={phone}
            setPhone={setPhone}
            required={question.required && props.isNewClient}
            placeholder={question.placeholder || ""}
          />
        </label>
      </div>
    );
  }

  function renderDateOfIntake(question: IntakeQuestion) {
    return (
      props.showDateOfIntake && (
        <div>
          <label>
            <span>{question.label}</span>
            <input
              type="date"
              name="dateOfIntake"
              value={dateOfIntake}
              onChange={(evt) => setDateOfIntake(evt.target.value)}
              placeholder={question.placeholder || ""}
              required={question.required}
              autoFocus
            />
          </label>
        </div>
      )
    );
  }

  function getData(): ContactInformationFormClient {
    const data: ContactInformationFormClient = {
      phone: isEmpty(phone) ? null : phone,
      smsConsent,
      streetAddress: isEmpty(streetAddress.trim())
        ? null
        : capitalizeAll(streetAddress.trim()),
      city: isEmpty(city.trim()) ? null : capitalizeAll(city.trim()),
      state: isEmpty(state) ? null : state,
      zip: isEmpty(zip) ? null : zip,
      housing: isEmpty(housing) || housing === "unknown" ? null : housing,
      email: email ? email.toLowerCase() : null,
    };

    if (props.showDateOfIntake) {
      data.dateOfIntake = dateOfIntake;
    }

    return data;
  }
});

function getTodayAsString() {
  const date = dateFormat(new Date(), "yyyy-mm-dd");
  return date;
}

function capitalizeAll(str) {
  return str
    .split(/\s/)
    .map((s) => capitalize(s))
    .join(" ");
}

type ContactInformationInputsProps = {
  handleSubmit(evt: FormEvent): void;
  client: ContactInformationFormClient;
  children: JSX.Element | JSX.Element[];
  showDateOfIntake?: boolean;
  isNewClient: boolean;
  clientIntakeSettings: ClientIntakeSettings;
};

export type ContactInformationFormClient = {
  phone?: string;
  smsConsent?: boolean;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  housing?: string;
  email?: string;
  dateOfIntake?: string;
};

export enum HousingStatuses {
  renter = "Renter",
  homeowner = "Home Owner",
  other = "With family and friends",
  unknown = "Unknown",
}
