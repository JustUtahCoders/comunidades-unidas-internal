import React, { FormEvent } from "react";
import PhoneInput from "../../util/phone-input.component";
import StateSelect from "../../util/state-select.component";
import CityInput from "../../util/city-input.component";

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
  const [state, setState] = React.useState(props.client.state || "UT");
  const [zip, setZip] = React.useState(props.client.zip || "");
  const [housing, setHousing] = React.useState(
    props.client.housing || "renter"
  );
  const [email, setEmail] = React.useState(props.client.email || "");
  const [dateOfIntake, setDateOfIntake] = React.useState(
    props.client.dateOfIntake || getTodayAsString
  );

  const zipRef = React.useRef(null);

  React.useEffect(() => {
    // @ts-ignore
    ref.current = {
      getData
    };
  });

  return (
    <form onSubmit={props.handleSubmit} autoComplete="new-password">
      {props.showDateOfIntake && (
        <div>
          <label>
            <span>Date of Intake</span>
            <input
              type="date"
              name="dateOfIntake"
              value={dateOfIntake}
              onChange={evt => setDateOfIntake(evt.target.value)}
              autoFocus
            />
          </label>
        </div>
      )}
      <div>
        <label>
          <span>Phone number</span>
          <PhoneInput phone={phone} setPhone={setPhone} />
        </label>
      </div>
      <div>
        <label>
          <span>Wants text messages</span>
          <input
            type="checkbox"
            name="smsConsent"
            checked={smsConsent}
            onChange={evt => setSmsConsent(Boolean(evt.target.checked))}
            className="checkbox"
          />
        </label>
      </div>
      <div>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={evt => setEmail(evt.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
      </div>
      <div>
        <label>
          <span>Street Address</span>
          <input
            type="text"
            value={streetAddress}
            onChange={evt => setStreetAddress(evt.target.value)}
            required
            placeholder="1211 W. 3200 S."
            autoComplete="new-password"
          />
        </label>
      </div>
      <div>
        <label>
          <span>State</span>
          <StateSelect state={state} setState={setState} />
        </label>
      </div>
      <div>
        <label>
          <span>City</span>
          <CityInput
            state={state}
            city={city}
            setCity={setCity}
            nextInputRef={zipRef}
          />
        </label>
      </div>
      <div>
        <label>
          <span>ZIP Code</span>
          <input
            ref={zipRef}
            type="text"
            value={zip}
            onChange={evt => setZip(evt.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
      </div>
      <div>
        <label>
          <span>Rent or Own:</span>
          <select
            value={housing}
            name="housing"
            onChange={evt => setHousing(evt.target.value)}
            required
          >
            {Object.keys(HousingStatuses).map(key => (
              <option value={key} key={key}>
                {HousingStatuses[key]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {props.children}
    </form>
  );

  function getData(): ContactInformationFormClient {
    return {
      phone,
      smsConsent,
      streetAddress,
      city,
      state,
      zip,
      housing,
      email,
      dateOfIntake
    };
  }
});

function getTodayAsString() {
  const dateFormat = require("dateformat");
  const date = dateFormat(new Date(), "yyyy-mm-dd");
  return date;
}

type ContactInformationInputsProps = {
  handleSubmit(evt: FormEvent): void;
  client: ContactInformationFormClient;
  children: JSX.Element | JSX.Element[];
  showDateOfIntake?: boolean;
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
  other = "With family and friends"
}
