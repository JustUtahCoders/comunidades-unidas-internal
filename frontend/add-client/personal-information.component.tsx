import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import PhoneInput from "../util/phone-input.component";
import StateSelect from "../util/state-select.component";
import CityInput from "../util/city-input.component";

export default function PersonalInformation(props: StepComponentProps) {
  const [gender, setGender] = useState("female");
  const [genderExplanation, setGenderExplanation] = useState("");
  const [civilStatus, setCivilStatus] = useState(CivilStatus.SINGLE);
  const [phone, setPhone] = useState("");
  const [phoneCarrier, setPhoneCarrier] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("UT");
  const [zip, setZip] = useState("");
  const [owned, setOwned] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Great! Let's add their personal information.
        </div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            <span>First Name</span>
            <input
              type="text"
              value={props.clientState.firstName}
              required
              disabled
              autoFocus
            />
          </label>
        </div>
        <div>
          <label>
            <span>Last Name</span>
            <input
              type="text"
              value={props.clientState.lastName}
              required
              disabled
            />
          </label>
        </div>
        <div>
          <label>
            <span>Birthday</span>
            <input
              type="date"
              value={props.clientState.birthday}
              required
              disabled
            />
          </label>
        </div>
        <div>
          <label>
            <span>Gender</span>
            <select
              value={gender}
              onChange={evt => setGender(evt.target.value)}
              required
              autoFocus
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="transgender">Transgender</option>
              <option value="other">Other (please explain)</option>
            </select>
          </label>
        </div>
        {gender === "other" && (
          <div>
            <label>
              <span>Explanation</span>
              <textarea
                value={genderExplanation}
                onChange={evt => setGenderExplanation(evt.target.value)}
                required
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Civil status</span>
            <select
              value={civilStatus}
              name="civilStatus"
              onChange={evt => setCivilStatus(CivilStatus[evt.target.value])}
              required
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="commonLawMarriage">
                Common law marriage (unión libre)
              </option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </label>
        </div>
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
            />
          </label>
        </div>
        {smsConsent === true && (
          <div>
            <label>
              <span>Mobile Carrier</span>
              <select
                value={phoneCarrier}
                name="phoneCarrier"
                onChange={evt => setPhoneCarrier(evt.target.value)}
                required
              >
                <option value="Att">Att</option>
                <option value="TMobile">T-Mobile</option>
                <option value="Verizon">Verizon</option>
                <option value="Virgin">Virgin Mobile</option>
                <option value="Metro">Metro PCS</option>
                <option value="Cricket">Cricket</option>
                <option value="Boost">Boost Mobile</option>
                <option value="Sprint">Sprint</option>
                <option value="Tracfone">Tracfone</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Street Address</span>
            <input
              type="text"
              value={streetAddress}
              onChange={evt => setStreetAddress(evt.target.value)}
              required
              placeholder="1211 W. 3200 S."
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
            <CityInput state={state} city={city} setCity={setCity} />
          </label>
        </div>
        <div>
          <label>
            <span>ZIP Code</span>
            <input
              type="text"
              value={zip}
              onChange={evt => setZip(evt.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>Rent or Own:</span>
            <select
              value={owned}
              name="owned"
              onChange={evt => setOwned(evt.target.value)}
              required
            >
              <option value="Rent">Rent</option>
              <option value="Own">Own</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={evt => setEmail(evt.target.value)}
              required
            />
          </label>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.CHECK_DUPLICATE)}
          >
            Go back
          </button>
          <button type="submit" className="primary">
            Next step
          </button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.GLOBAL_BACKGROUND, {
      gender: Gender[gender],
      genderExplanation: gender === "other" ? genderExplanation : null,
      civilStatus,
      phone,
      smsConsent,
      phoneCarrier,
      streetAddress,
      city,
      state,
      zip,
      owned,
      email
    });
  }
}

export enum Gender {
  FEMALE = "female",
  MALE = "male",
  TRANSGENDER = "transgender",
  OTHER = "other"
}

export enum CivilStatus {
  SINGLE = "single",
  MARRIED = "married",
  COMMON_LAW_MARRIAGE = "commonLawMarriage",
  DIVORCED = "divorced",
  WIDOWED = "widowed"
}
