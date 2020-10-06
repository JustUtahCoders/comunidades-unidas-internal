import { useCss } from "kremling";
import React, { FormEvent } from "react";
import { NewPartnerService, Partner } from "./partners.component";
import css from "./partner-inputs.css";

export default function PartnerServiceInputs(props: PartnerServiceInputs) {
  return (
    <form ref={props.formRef} onSubmit={props.handleSubmit} {...useCss(css)}>
      {props.showSelectPartner && (
        <div className="form-group">
          <label htmlFor="partner-name">Partner:</label>
          <select
            value={props.partnerId || ""}
            onChange={(evt) => props.setPartnerId(Number(evt.target.value))}
          >
            {props.partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="partner-name">Partner Service:</label>
        <input
          id="partner-name"
          type="text"
          value={props.partnerService.name}
          onChange={(evt) =>
            props.setPartnerService({
              ...props.partnerService,
              name: evt.target.value,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="partner-active">Is active:</label>
        <input
          id="partner-active"
          type="checkbox"
          checked={props.partnerService.isActive}
          onChange={(evt) =>
            props.setPartnerService({
              ...props.partnerService,
              isActive: evt.target.checked,
            })
          }
        />
      </div>
    </form>
  );
}

type PartnerServiceInputs = {
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit(evt: FormEvent): any;
  partnerService: NewPartnerService;
  setPartnerService(program: NewPartnerService): void;
  showSelectPartner?: boolean;
  partnerId?: number;
  setPartnerId?(partnerId: number): any;
  partners?: Partner[];
};
