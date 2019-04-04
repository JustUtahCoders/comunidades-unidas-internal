import React, { useState } from "react";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";
import CheckDuplicate from "./check-duplicate.component";
// import PersonalInformation, {
//   CivilStatus,
//   Gender
// } from "./personal-information.component";
//import GlobalBackground, { EnglishLevel } from "./global-background.component";
//import IncomeInformation, { PayInterval } from "./income-information.component";
//import ClientSource from "./client-source.component";
//import Services from "./services.component";
import ListDuplicates from "./list-duplicate.component";
import AddContact from "./add-contact.component";
import AddDemographics from "./add-demographic.component";
import Confirm from "./confirm.component";

export default function AddClient(props: AddClientProps) {
  const scope = useCss(css);
  const [step, setStep] = useState<Step>(Step.CHECK_DUPLICATE);
  const [clientState, setClientState] = useState<ClientState>({});
  const StepComponent = stepComponents[step];

  return (
    <div {...scope}>
      <PageHeader title="Add a new client" />
      <div className="card">
        <div className="form-with-hints">
          <StepComponent
            nextStep={nextStep}
            clientState={clientState}
            goBack={goBack}
            reset={reset}
          />
        </div>
      </div>
    </div>
  );

  function nextStep(stepName: Step, newState: ClientState) {
    setClientState({ ...clientState, ...newState });
    setStep(stepName);
  }

  function goBack(step: Step) {
    setStep(step);
  }

  function reset() {
    setClientState({});
    setStep(Step.CHECK_DUPLICATE);
  }
}

const css = `
& form > div {
  margin-bottom: 16rem;
}

& .form-with-hints {
  display: flex;
  justify-content: flex-start;
}

& .hints-and-instructions {
  width: 300rem;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16rem;
}

& .hint-icon {
  height: 70rem;
  margin-bottom: 16rem;
}

& .instruction {
  max-width: 200rem;
}

& label {
  display: flex;
  align-items: center;
}

& form > div > label > span {
  display: inline-block;
  width: 140rem;
  text-align: right;
  margin-right: 24rem;
}

& .actions {
  display: flex;
  justify-content: center;
  margin-top: 32rem;
}

& .vertical-options {
  display: block;
}
`;

export enum Step {
  CHECK_DUPLICATE = "CHECK_DUPLICATE",
  LIST_DUPLICATES = "LIST_DUPLICATES",
  ADD_CONTACT = "ADD_CONTACT",
  ADD_DEMOGRAPHICS = "ADD_DEMOGRAPHIC",
  //PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
  //GLOBAL_BACKGROUND = "GLOBAL_BACKGROUND",
  //INCOME_INFORMATION = "INCOME_INFORMATION",
  //CLIENT_SOURCE = "CLIENT_SOURCE",
  //SERVICES = "SERVICES",
  //FINISHED = "FINISHED"
  CONFIRM = "CONFIRM"
}

const stepComponents = {
  [Step.CHECK_DUPLICATE]: CheckDuplicate,
  [Step.LIST_DUPLICATES]: ListDuplicates,
  [Step.ADD_CONTACT]: AddContact,
  [Step.ADD_DEMOGRAPHICS]: AddDemographics,
  //[Step.PERSONAL_INFORMATION]: PersonalInformation,
  //[Step.GLOBAL_BACKGROUND]: GlobalBackground,
  //[Step.INCOME_INFORMATION]: IncomeInformation,
  //[Step.CLIENT_SOURCE]: ClientSource,
  //[Step.SERVICES]: Services,
  //[Step.FINISHED]: Finished
  [Step.CONFIRM]: Confirm
};

type AddClientProps = {
  path: string;
};

type ClientState = {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  gender?: Gender;
  genderExplanation?: string;
  duplicates?: [];
  //Contacts
  phone?: string;
  smsConsent?: string;
  phoneCarrier?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  owned?: string;
  email?: string;
  //Demographics
  civilStatus?: CivilStatus;
  countryOfOrigin?: string;
  dateUSArrival?: string;
  primaryLanguage?: string;
  englishLevel?: EnglishLevel;
  currentlyEmployed?: string;
  employmentSector?: string;
  payInterval?: PayInterval;
  hoursWorked?: number;
  annualIncome?: number;
  houseHoldSize?: number;
  dependents?: number;
};

export type StepComponentProps = {
  nextStep: (stepName: string, newClientState: ClientState) => void;
  clientState: ClientState;
  goBack(Step): void;
  reset(): void;
};
