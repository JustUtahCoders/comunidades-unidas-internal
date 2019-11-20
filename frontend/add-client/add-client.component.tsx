import React, { useState } from "react";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";

import CheckDuplicate from "./check-duplicate.component";
import ListDuplicates from "./list-duplicates.component";
import ContactInformation from "./contact-information.component";
import ClientSource from "./client-source.component";
import Confirm from "./confirm.component";
import DemographicInformation from "./demographic-information.component";
import {
  PayInterval,
  CivilStatus
} from "./form-inputs/demographic-information-inputs.component";
import Services from "./services.component";
import Finished from "./finished.component";

import { mediaMobile, mediaDesktop } from "../styleguide.component";
import { WeeklyEmployedHours } from "./form-inputs/demographic-information-inputs.component";
import { IntakeService } from "../util/services-inputs.component";

export default function AddClient(props: AddClientProps) {
  const scope = useCss(css);

  const [step, setStep] = useState<Step>(Step.CHECK_DUPLICATE);
  const [clientState, setClientState] = useState<ClientState>({});
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateWarning>(
    null
  );
  const StepComponent = stepComponents[step];

  return (
    <div {...scope}>
      <PageHeader title="Add a new client" />
      <div className="card">
        <div className="form-with-hints">
          {duplicateWarning ? (
            <ListDuplicates
              duplicateWarning={duplicateWarning}
              continueAnyway={continueAnyway}
              goBack={reset}
            />
          ) : (
            <StepComponent
              nextStep={nextStep}
              clientState={clientState}
              goBack={goBack}
              reset={reset}
              showDuplicateWarning={showDuplicateWarning}
            />
          )}
        </div>
      </div>
    </div>
  );

  function nextStep(stepName: Step, newState: ClientState) {
    setClientState({ ...clientState, ...newState });
    setStep(stepName);
  }

  function goBack(step: Step, newState: ClientState) {
    setClientState({ ...clientState, ...newState });
    setStep(step);
  }

  function reset() {
    setDuplicateWarning(null);
    setClientState({});
    setStep(Step.CHECK_DUPLICATE);
  }

  function showDuplicateWarning(duplicateWarning) {
    setDuplicateWarning(duplicateWarning);
  }

  function continueAnyway(clientState) {
    setStep(Step.CONTACT_INFORMATION);
    setDuplicateWarning(null);
    setClientState(clientState);
  }
}

export enum Step {
  CHECK_DUPLICATE = "CHECK_DUPLICATE",
  LIST_DUPLICATES = "LIST_DUPLICATES",
  CONTACT_INFORMATION = "CONTACT_INFORMATION",
  DEMOGRAPHICS_INFORMATION = "DEMOGRAPHICS_INFORMATION",
  CLIENT_SOURCE = "CLIENT_SOURCE",
  SERVICES = "SERVICES",
  CONFIRM = "CONFIRM",
  FINISHED = "FINISHED"
}

const stepComponents = {
  [Step.CHECK_DUPLICATE]: CheckDuplicate,
  [Step.CONTACT_INFORMATION]: ContactInformation,
  [Step.DEMOGRAPHICS_INFORMATION]: DemographicInformation,
  [Step.CLIENT_SOURCE]: ClientSource,
  [Step.SERVICES]: Services,
  [Step.CONFIRM]: Confirm,
  [Step.FINISHED]: Finished
};

type AddClientProps = {
  path: string;
};

export type ClientState = {
  id?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  gender?: string;
  duplicates?: [];
  //Contacts
  dateOfIntake?: string;
  phone?: string;
  smsConsent?: boolean;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  housing?: string;
  email?: string;
  //Demographics
  civilStatus?: CivilStatus;
  countryOfOrigin?: string;
  dateOfUSArrival?: string;
  homeLanguage?: string;
  englishLevel?: string;
  currentlyEmployed?: string;
  employmentSector?: string;
  payInterval?: PayInterval;
  weeklyEmployedHours?: WeeklyEmployedHours;
  householdIncome?: number;
  householdSize?: number;
  juvenileDependents?: number;
  isStudent?: boolean;
  eligibleToVote?: boolean;
  registerToVote?: boolean;
  // Client source
  clientSource?: ClientSources | string;
  couldVolunteer?: boolean;
  // Intake services
  intakeServices?: IntakeService[];
};

export type StepComponentProps = {
  nextStep: (stepName: string, newClientState: ClientState) => void;
  clientState: ClientState;
  goBack(Step, newClientState?): void;
  reset(): void;
  showDuplicateWarning(DuplicateWarning): void;
};

export type DuplicateWarning = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  duplicates: Duplicate[];
};

export enum ClientSources {
  facebook = "facebook",
  instagram = "instagram",
  website = "website",
  promotionalMaterial = "promotionalMaterial",
  consulate = "consulate",
  friend = "friend",
  previousClient = "previousClient",
  employee = "employee",
  sms = "sms",
  radio = "radio",
  tv = "tv"
}

type Duplicate = {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
};

export const css = `
& form > div {
  margin-bottom: 1.6rem;
}

& .form-with-hints {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

& .hints-and-instructions {
  margin-bottom: 3.2rem;
}

& .form-with-hints form {
  align-self: center;
}

& .form-with-hints form input[type="checkbox"] {
  min-width: inherit;
  width: inherit;
  margin-right: .8rem;
}

${mediaMobile} {
  & .hints-and-instructions {
    width: 30rem;
  }

  & form {
    font-size: 1.6rem;
  }

  & .form-with-hints form input:not([type="radio"]):not([type="checkbox"]), & .form-with-hints form select {
    width: 16.75rem;
    font-size: 1.6rem;
  }

  & .form-with-hints form {
    width: 30rem;
  }

  & .form-with-hints form > div > label > span {
    width: 10rem;
    font-size: 1.6rem;
  }

  & .form-with-hints > .hints-and-instructions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.8rem;
  }

  & .form-with-hints form input:([type="checkbox"]) {
    min-width: 20rem;
    max-width: 30rem;
    margin-left: 3rem;
  }
}

${mediaDesktop} {
  & .form-with-hints form input:not([type="radio"]):not([type="checkbox"]), & .form-with-hints form select {
    min-width: 20rem;
    max-width: 30rem;
  }
}

& .hints-and-instructions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2rem;
}

& .hint-icon {
  height: 10rem;
  margin-top: 1.6rem;
  margin-bottom: .8rem;
}

& .instruction {
  max-width: 35rem;
}

& label, & [role=group] {
  display: flex;
  align-items: center;
}

& form > div > label > span,
& form > div > [role=group] > span {
  display: inline-block;
  width: 14rem;
  text-align: right;
  margin-right: 2.4rem;
  font-size: 1.8rem;
}

& form .radio-options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

& .actions {
  display: flex;
  justify-content: center;
  margin-top: 3.2rem;
}

& .vertical-options {
  display: block;
}

& .vertical-options > * {
  padding: .8rem 0;
}
`;
