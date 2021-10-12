import React from "react";
import { StepComponentProps, Step } from "./add-client.component";
import targetIconUrl from "../../icons/148705-essential-collection/svg/target.svg";
import ClientSourceInputs from "./form-inputs/client-source-inputs.component";

export default function ClientSource(props: StepComponentProps) {
  const inputsRef = React.useRef(null);

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img
            src={targetIconUrl}
            className="hint-icon"
            alt="Icon of a target"
          />
        </div>
        <div className="instruction">
          Let's track how this client heard about Comunidades Unidas.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ClientSourceInputs
          client={props.clientState}
          ref={inputsRef}
          isNewClient
          clientIntakeSettings={props.clientIntakeSettings}
        />
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => {
              props.goBack(
                Step.DEMOGRAPHICS_INFORMATION,
                getClientSourceData()
              );
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
    props.nextStep(Step.SERVICES, getClientSourceData());
  }

  function getClientSourceData() {
    const d = inputsRef.current;
    return {
      clientSource: d.clientSource,
      couldVolunteer: d.couldVolunteer,
    };
  }
}
