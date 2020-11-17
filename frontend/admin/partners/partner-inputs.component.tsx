import { useCss } from "kremling";
import React, { FormEvent } from "react";
import { NewPartner, Partner } from "./partners.component";
import css from "./partner-inputs.css";
import PhoneInput from "../../util/phone-input.component";

export default function PartnerInputs(props: PartnerInputsProps) {
  return (
    <form ref={props.formRef} onSubmit={props.handleSubmit} {...useCss(css)}>
      <div className="form-group">
        <label htmlFor="partner-name">Partner name:</label>
        <input
          id="partner-name"
          type="text"
          value={props.partner.name}
          onChange={(evt) =>
            props.setPartner({
              ...props.partner,
              name: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="partner-active">Is active:</label>
        <input
          id="partner-active"
          type="checkbox"
          checked={props.partner.isActive}
          onChange={(evt) =>
            props.setPartner({
              ...props.partner,
              isActive: evt.target.checked,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="partner-phone">Phone number:</label>
        <PhoneInput
          phone={props.partner.phone || ""}
          setPhone={(phone) =>
            props.setPartner({
              ...props.partner,
              phone,
            })
          }
        />
      </div>
    </form>
  );
}

type PartnerInputsProps = {
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit(evt: FormEvent): any;
  partner: NewPartner;
  setPartner(partner: NewPartner): void;
};
