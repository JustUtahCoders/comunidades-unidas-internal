import React, { useState } from "react";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";
import SearchClient from "./search-client.component";
import SearchResult from "./search-result.component";
import { mediaMobile, mediaDesktop } from "../styleguide.component";

export default function ViewClients(props: SearchClientProps) {
  const scope = useCss(css);
  const [step, setStep] = useState<Step>(Step.SEARCH_CLIENT);
  const [clientState, setClientState] = useState<ClientState>({});
  const StepComponent = stepComponents[step];

  return (
    <div {...scope}>
      <PageHeader title="Clients" />
      <div className="card">
        <div className="form-with-hints">
          <StepComponent
            nextStep={nextStep}
            clientState={clientState}
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

  function reset() {
    setClientState({});
    setStep(Step.SEARCH_CLIENT);
  }
}

type SearchClientProps = {
  path: string;
};

export enum Step {
  SEARCH_CLIENT = "SEARCH_CLIENT",
  SEARCH_RESULT = "SEARCH_RESULT"
}
const stepComponents = {
  [Step.SEARCH_CLIENT]: SearchClient,
  [Step.SEARCH_RESULT]: SearchResult
};

export type ClientState = {
  firstName?: string;
  lastName?: string;
  zip?: string;
  searchResult?: [];
};

export type StepComponentProps = {
  nextStep: (stepName: string, newClientState: ClientState) => void;
  clientState: ClientState;
  reset(): void;
};

const css = `
& form > div {
  margin-bottom: 16rem;
}

& .form-with-hints {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

& .hints-and-instructions {
  margin-bottom: 32rem;
}

& .form-with-hints form {
  align-self: center;
}

& .form-with-hints form input[type="checkbox"] {
  min-width: inherit;
  width: inherit;
  margin-right: 8rem;
}

${mediaMobile} {
  & .form-with-hints form input, & .form-with-hints form select {
    width: 170rem;
  }

  & .form-with-hints form {
    width: 350rem;
  }
}

${mediaDesktop} {
  & .form-with-hints form input, & .form-with-hints form select {
    min-width: 200rem;
    max-width: 300rem;
  }
}


& .hints-and-instructions {
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

& .vertical-options > * {
  padding: 8rem 0;
}
`;
