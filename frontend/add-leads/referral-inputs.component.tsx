import dayjs from "dayjs";
import { useCss } from "kremling";
import React from "react";
import { FullPartner } from "../admin/partners/partners.component";
import { Referral } from "../view-edit-client/interactions/single-interaction-slat.component";
import css from "./referral-inputs.css";

const ReferralInputs = React.forwardRef<ReferralInputRef, ReferralInputProps>(
  (props: ReferralInputProps, ref: React.Ref<ReferralInputRef>) => {
    const [partnerServiceIds, setPartnerServiceIds] = React.useState(() =>
      props.referrals.map((r) => r.partnerServiceId)
    );
    const [referralDate, setReferralDate] = React.useState<string>(
      () => props.defaultReferralDate || dayjs().format("YYYY-MM-DD")
    );

    React.useImperativeHandle(ref, () => ({
      getReferrals() {
        return partnerServiceIds.map((partnerServiceId) => ({
          referralDate,
          partnerServiceId,
        }));
      },
    }));

    console.log(partnerServiceIds);

    return (
      <div {...useCss(css)}>
        <div className="form-group">
          <label htmlFor="referral-date">Referral Date:</label>
          <input
            id="referral-date"
            type="date"
            value={referralDate}
            onChange={(evt) => setReferralDate(evt.target.value)}
            required
          />
        </div>
        <div>
          {props.partners.map((partner) => (
            <div key={partner.id}>
              <h4>{partner.name}</h4>
              {partner.services.map((service) => (
                <div key={service.id}>
                  <label>
                    <input
                      type="checkbox"
                      name="services"
                      checked={partnerServiceIds.includes(service.id)}
                      onChange={toggleCheckbox}
                      value={service.id}
                    />
                    {service.name}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    function toggleCheckbox(evt) {
      if (evt.target.checked) {
        setPartnerServiceIds(
          partnerServiceIds.concat(Number(evt.target.value))
        );
      } else {
        setPartnerServiceIds(
          partnerServiceIds.filter(
            (serviceId) => serviceId !== Number(evt.target.value)
          )
        );
      }
    }
  }
);

type ReferralInputProps = {
  referrals: Referral[];
  partners: FullPartner[];
  defaultReferralDate?: string;
};

export type ReferralInputRef = {
  getReferrals(): Referral[];
};

export default ReferralInputs;
