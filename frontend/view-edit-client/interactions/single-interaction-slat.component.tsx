import React, { useImperativeHandle } from "react";
import { useCss, a } from "kremling";
import { CUServicesList } from "../../add-client/services.component";
import { FullPartner } from "../../admin/partners/partners.component";
import ServiceInteractionInputs, {
  ClientInteraction,
} from "./service-interaction-inputs.component";
import FollowUpInteractionInputs from "./follow-up-interaction-inputs.component";
import ReferralInteractionInputs from "./referral-interaction-inputs.component";

enum InteractionKind {
  cuService = "cuService",
  partnerReferral = "partnerReferral",
  followUp = "followUp",
}

const InteractionKindInputs = {
  [InteractionKind.cuService]: ServiceInteractionInputs,
  [InteractionKind.partnerReferral]: ReferralInteractionInputs,
  [InteractionKind.followUp]: FollowUpInteractionInputs,
};

const SingleInteractionSlat = React.forwardRef<
  InteractionInputsRef,
  SingleClientInteractionProps
>((props, ref) => {
  const scope = useCss(css);
  const [interactionKind, setInteractionKind] = React.useState<InteractionKind>(
    InteractionKind.cuService
  );
  const followUpsEnabled = localStorage.getItem("follow-ups") === "true";
  const [name, setName] = React.useState("");

  const Inputs = InteractionKindInputs[interactionKind];

  return (
    <div
      className={a("single-client-interaction").m("in-well", props.inWell)}
      {...scope}
    >
      <div className="header">
        {props.inWell && (
          <h3 className="interaction-number">
            #{props.interactionIndex + 1} {name}
          </h3>
        )}
        {props.interactionIndex > 0 && (
          <button
            type="button"
            className="unstyled"
            onClick={props.removeInteraction}
          >
            {"\u24E7"}
          </button>
        )}
      </div>
      <div className="inputs">
        {!props.hideInteractionKind && (
          <>
            <label>Type:</label>
            <div className="interaction-kind">
              <input
                id={`kind-service-provided-${props.interactionIndex}`}
                type="radio"
                name={`interaction-kind-${props.interactionIndex}`}
                value={InteractionKind.cuService}
                checked={interactionKind === InteractionKind.cuService}
                onChange={updateInteractionKind}
              />
              <label
                htmlFor={`kind-service-provided-${props.interactionIndex}`}
              >
                Service Provided
              </label>
              <input
                id={`kind-referral-${props.interactionIndex}`}
                type="radio"
                name={`interaction-kind-${props.interactionIndex}`}
                value={InteractionKind.partnerReferral}
                checked={interactionKind === InteractionKind.partnerReferral}
                onChange={updateInteractionKind}
              />
              <label htmlFor={`kind-referral-${props.interactionIndex}`}>
                Referral
              </label>
              {followUpsEnabled && (
                <>
                  <input
                    id={`kind-follow-up-${props.interactionIndex}`}
                    type="radio"
                    name={`interaction-kind-${props.interactionIndex}`}
                    value={InteractionKind.followUp}
                    checked={interactionKind === InteractionKind.followUp}
                    onChange={updateInteractionKind}
                  />
                  <label htmlFor={`kind-follow-up-${props.interactionIndex}`}>
                    Follow-up
                  </label>
                </>
              )}
            </div>
          </>
        )}
        <Inputs
          interactionIndex={props.interactionIndex}
          servicesResponse={props.servicesResponse}
          partnersResponse={props.partnersResponse}
          clientId={props.clientId}
          setName={setName}
          ref={ref}
          initialInteraction={props.initialInteraction}
        />
      </div>
    </div>
  );

  function updateInteractionKind(evt: React.ChangeEvent<HTMLInputElement>) {
    setInteractionKind(evt.target.value as InteractionKind);
  }
});

export default SingleInteractionSlat;

export const css = `
& .single-client-interaction {
  padding: .8rem .6rem;
  margin-top: 1.6rem;
}

& .single-client-interaction.in-well {
  background-color: var(--colored-well);
  border-radius: .5rem;
}

& .interaction-number {
  margin-top: 0;
}

& .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

& .header button {
  cursor: pointer;
}

& .inputs {
  display: grid;
  grid-template-columns: 1fr 3fr;
  row-gap: 1.6rem;
  column-gap: 1.6rem;
  align-items: center;
}

& .inputs input {
  width: min-content;
}

& .inputs label {
  text-align: right;
}

& .services-select {
  min-width: 100%;
}

& .in-well button.icon:hover {
  background-color: #ffd08a;
}

& .interaction-kind label {
  padding-right: 1.6rem;
}
`;

export enum InteractionType {
  inPerson = "In Person",
  byPhone = "By Phone",
  workshopTalk = "Workshop / Talk",
  oneOnOneLightTouch = "One On One / Light Touch",
  consultation = "Consultation",
}

export enum InteractionLocation {
  CUOffice = "CU Office",
  consulateOffice = "Consulate Office",
  communityEvent = "Community Event",
}

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  partnersResponse: FullPartner[];
  interactionIndex: number;
  removeInteraction(): any;
  inWell?: boolean;
  clientId: string;
  hideInteractionKind?: boolean;
  initialInteraction?: ClientInteraction;
};

export type Referral = {
  partnerServiceId: number;
  referralDate: string;
};

export type InteractionInputsProps = {
  interactionIndex: number;
  servicesResponse: CUServicesList;
  partnersResponse: FullPartner[];
  clientId: string;
  setName(string): any;
  initialInteraction?: ClientInteraction;
};

export type InteractionInputsRef = {
  save(abortSignal: AbortSignal, options?: any): Promise<any>;
};
