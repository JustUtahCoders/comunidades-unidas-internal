import React, { useEffect, useImperativeHandle } from "react";
import { PartnerService } from "../../admin/partners/partners.component";
import {
  InteractionInputsProps,
  InteractionInputsRef,
} from "./single-interaction-slat.component";
import dayjs from "dayjs";
import easyFetch from "../../util/easy-fetch";

const ReferralInteractionInputs = React.forwardRef<
  InteractionInputsRef,
  InteractionInputsProps
>((props, ref) => {
  const [partnerService, setPartnerService] = React.useState<PartnerService>(
    null
  );
  const [referralDate, setReferralDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const partnerServices = props.partnersResponse.reduce((result, partner) => {
    return result.concat(...partner.services);
  }, []);

  useImperativeHandle(ref, () => ({
    getName() {
      return partnerService ? partnerService.name : "";
    },
    save(signal) {
      const now = dayjs();
      const isToday =
        dayjs(referralDate).format("YYYY-MM-DD") ===
        dayjs().format("YYYY-MM-DD");
      const referral = {
        partnerServiceId: partnerService.id,
        referralDate: isToday
          ? dayjs().toISOString()
          : dayjs(referralDate + now.format(" hh:mm")).toISOString(),
      };

      return easyFetch(`/api/clients/${props.clientId}/referrals`, {
        method: "POST",
        body: referral,
        signal,
      });
    },
  }));

  useEffect(() => {
    props.setName(partnerService ? partnerService.name : "");
  }, [partnerService, props.setName]);

  return (
    <>
      <label id={`provided-service-${props.interactionIndex}`}>Service:</label>
      <select
        value={partnerService ? partnerService.id : ""}
        onChange={(evt) => {
          const serviceId = Number(evt.target.value.slice("Partner".length));
          setPartnerService(partnerServices.find((ps) => ps.id === serviceId));
        }}
        aria-labelledby={`provided-service-${props.interactionIndex}`}
        className="services-select"
        name={`provided-service-${props.interactionIndex}`}
        required
      >
        <option value="" disabled hidden>
          Choose here
        </option>
        {props.partnersResponse.map((partner) => (
          <optgroup label={partner.name + " (Referral)"} key={partner.id}>
            {partner.services.map((partnerService) => (
              <option
                key={partnerService.id}
                value={"Partner" + partnerService.id}
              >
                {partnerService.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <label id={`interaction-date-${props.interactionIndex}`}>Date:</label>
      <input
        type="date"
        value={referralDate}
        onChange={(evt) => setReferralDate(evt.target.value)}
        aria-labelledby={`interaction-date-${props.interactionIndex}`}
        required
      />
    </>
  );
});

export default ReferralInteractionInputs;
