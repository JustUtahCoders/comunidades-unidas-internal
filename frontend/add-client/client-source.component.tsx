import React, { useState } from "react";
import {
  StepComponentProps,
  Step,
  ClientSources
} from "./add-client.component";
import targetIconUrl from "../../icons/148705-essential-collection/svg/target.svg";

export default function ClientSource(props: StepComponentProps) {
  const getInitialClientSource = () => {
    if (
      props.clientState.clientSource &&
      !ClientSources[props.clientState.clientSource]
    ) {
      return "other";
    } else if (ClientSources[props.clientState.clientSource]) {
      return ClientSources[props.clientState.clientSource];
    } else {
      return "friend";
    }
  };

  const [clientSource, setClientSource] = useState(getInitialClientSource());
  const [otherSource, setOtherSource] = useState(
    ClientSources[props.clientState.clientSource]
      ? ""
      : props.clientState.clientSource
  );
  const [couldVolunteer, setCouldVolunteer] = useState(
    props.clientState.couldVolunteer || false
  );

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={targetIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Let's track how this client heard about Comunidades Unidas.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>How did they hear about Comunidades Unidas</span>
            <select
              value={clientSource}
              onChange={evt => setClientSource(evt.target.value)}
              autoFocus
              required
            >
              <option value={ClientSources.facebook}>Facebook</option>
              <option value={ClientSources.instagram}>Instagram</option>
              <option value={ClientSources.website}>Website</option>
              <option value={ClientSources.promotionalMaterial}>
                Promotional Material
              </option>
              <option value={ClientSources.consulate}>Consulate</option>
              <option value={ClientSources.friend}>Friend</option>
              <option value={ClientSources.previousClient}>
                Comunidades Unidas client
              </option>
              <option value={ClientSources.employee}>
                Comunidades Unidas employee
              </option>
              <option value={ClientSources.sms}>Text message</option>
              <option value={ClientSources.radio}>Radio</option>
              <option value={ClientSources.tv}>TV</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {clientSource === "other" && (
          <div>
            <label>
              <span>Other source</span>
              <input
                type="text"
                value={otherSource}
                onChange={evt => setOtherSource(evt.target.value)}
                required
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Would they like to volunteer for Comunidades Unidas?</span>
            <input
              type="checkbox"
              name="couldVolunteer"
              checked={couldVolunteer}
              onChange={evt => setCouldVolunteer(Boolean(evt.target.checked))}
            />
          </label>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => {
              props.goBack(Step.DEMOGRAPHICS_INFORMATION, {
                clientSource:
                  clientSource === "other" ? otherSource : clientSource,
                couldVolunteer
              });
            }}
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
    props.nextStep(Step.SERVICES, {
      clientSource: clientSource === "other" ? otherSource : clientSource,
      couldVolunteer
    });
  }
}
