import React from "react";
import { useCss } from "kremling";
import { StepComponentProps, Step, ClientState } from "./add-client.component";
import homeUrl from "../../icons/148705-essential-collection/svg/home.svg";
import ContactInformationInputs, {
  ContactInformationFormClient
} from "./form-inputs/contact-information-inputs.component";

export default function ContactInformation(props: StepComponentProps) {
  const scope = useCss(css);
  const contactInfoRef = React.useRef(null);

  return (
    <>
      <div className="hints-and-instructions" {...scope}>
        <div>
          <img src={homeUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Ok. Now, lets add a contact and address for{" "}
          <span className="client-name">
            {props.clientState.firstName} {props.clientState.lastName}
          </span>
          .
        </div>
      </div>
      <ContactInformationInputs
        client={props.clientState}
        handleSubmit={handleSubmit}
        ref={contactInfoRef}
        showDateOfIntake={true}
      >
        <div className="actions">
          <button type="button" className="secondary" onClick={goBack}>
            Go back
          </button>
          <button type="submit" className="primary">
            Next step
          </button>
        </div>
      </ContactInformationInputs>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(
      Step.DEMOGRAPHICS_INFORMATION,
      transformInputsData(contactInfoRef.current.getData())
    );
  }

  function goBack(evt) {
    props.goBack(
      Step.CHECK_DUPLICATE,
      transformInputsData(contactInfoRef.current.getData())
    );
  }

  function transformInputsData(
    inputs: ContactInformationFormClient
  ): ClientState {
    return {
      phone: inputs.phone,
      smsConsent: inputs.smsConsent,
      streetAddress: inputs.streetAddress,
      city: inputs.city,
      state: inputs.state,
      zip: inputs.zip,
      housing: inputs.housing,
      email: inputs.email,
      dateOfIntake: inputs.dateOfIntake
    };
  }
}

const css = `
& .client-name {
  font-weight: bold;
}
`;
