import React from "react";
import PhoneInput from "../../util/phone-input.component";
import { useCss } from "kremling";

export default function LeadContactInformationInputs(
  props: LeadContactInformationInputsProps
) {
  const [phone, setPhone] = React.useState(props.lead.phone || "");
  const [smsConsent, setSmsConsent] = React.useState(
    props.lead.smsConsent || false
  );
  const [zip, setZip] = React.useState(props.lead.zip || "");
  const scope = useCss(css);

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="edit-form"
      {...scope}
    >
      <div>
        <label>
          <span>Phone number:</span>
          <PhoneInput phone={phone} setPhone={setPhone} autoFocus />
        </label>
      </div>
      <div>
        <label>
          <span>Wants text messages:</span>
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
          <span>Zip Code:</span>
          <input
            type="text"
            value={zip || ""}
            onChange={evt => setZip(evt.target.value)}
            autoComplete="new-password"
          />
        </label>
      </div>
      <div className="children-container">{props.children}</div>
    </form>
  );

  function handleSubmit(evt) {
    return props.handleSubmit(evt, {
      phone: phone,
      smsConsent: smsConsent,
      zip: zip
    });
  }
}

const css = `
& div > label > span {
  display: inline-block;
  width: 19.6rem;
}

& div > label > input[type="text"], & div > label > input[type="tel"] {
  width: 14rem;
}
`;

type LeadContactInformationInputsProps = {
  lead: LeadContactInfo;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: LeadContactInfo);
};

type LeadContactInfo = {
  phone?: string;
  smsConsent?: boolean;
  zip?: string;
};
