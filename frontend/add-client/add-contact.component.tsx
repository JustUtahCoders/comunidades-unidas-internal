import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import contactIconUrl from "../../icons/148705-essential-collection/svg/id-card-5.svg";
import PhoneInput from "../util/phone-input.component";
import StateSelect from "../util/state-select.component";

export default function ContactInformation(props: StepComponentProps) {
  const [phone, setPhone] = useState("");
  const [phoneCarrier, setPhoneCarrier] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("UT");
  const [zip, setZip] = useState("");
  const [owned, setOwned] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={contactIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Ok. Now, lets add a contact and addres for{" "}
          <strong>
            {props.clientState.firstName} {props.clientState.lastName}
          </strong>
          .
        </div>
      </div>
      <form onSubmit={handleSubmit}>
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
                <option>Select one</option>
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
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={evt => setEmail(evt.target.value)}
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
            />
          </label>
        </div>
        <div>
          <label>
            <span>City</span>
            <input
              type="text"
              value={city}
              onChange={evt => setCity(evt.target.value)}
              required
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
              <option>Select one</option>
              <option value="Rent">Rent</option>
              <option value="Own">Own</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.CHECK_DUPLICATE)}
          >
            Go back
          </button>
        </div>
      </form>
    </>
  );
  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.ADD_DEMOGRAPHICS, {
      phone,
      smsConsent: smsConsent ? "Yes" : "No",
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
