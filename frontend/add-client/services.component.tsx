import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import agendaIconUrl from "../../icons/148705-essential-collection/svg/agenda.svg";
import { useCss } from "kremling";
import easyFetch from "../util/easy-fetch";
import IntakeServicesInputs from "../util/services-inputs.component";
import { mediaMobile } from "../styleguide.component";

export default function Services(props: StepComponentProps) {
  const [services, setServices] = useState<CUService[]>([]);
  const intakeServicesRef = React.useRef(null);
  const scope = useCss(css);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/services", { signal: abortController.signal }).then(data =>
      setServices(data.services)
    );

    return () => abortController.abort();
  }, []);

  return (
    <div {...scope}>
      <div className="hints-and-instructions">
        <div>
          <img src={agendaIconUrl} className="hint-icon" alt="Agenda icon" />
        </div>
        <div className="instruction">
          What services are they interested in today?
          <div className="warning">
            This is not what Comunidades Unidas did for them in their first
            visit, but the services they might want in the future.
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <IntakeServicesInputs
          checkedServices={props.clientState.intakeServices}
          services={services}
          ref={intakeServicesRef}
        />
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() =>
              props.goBack(Step.CLIENT_SOURCE, {
                intakeServices: intakeServicesRef.current.checkedServices
              })
            }
          >
            Go back
          </button>
          <button
            type="submit"
            className="primary"
            disabled={services.length === 0}
          >
            Next step
          </button>
        </div>
      </form>
    </div>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.CONFIRM, {
      intakeServices: intakeServicesRef.current.checkedServices
    });
  }
}

const css = `
& .warning {
  font-weight: bold;
  font-style: italic;
  font-size: 1.6rem;
  padding: 0 1rem;
  margin-top: .8rem;
}

& form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

${mediaMobile} {
  & .vertical-options {
    margin-left: 1rem;
  }
}
`;

export type CUServicesList = {
  services: CUService[];
  programs: CUProgram[];
};

export type CUService = {
  id: number;
  serviceName: string;
  serviceDescription: string;
  programId: string;
  programName: string;
};

export type CUProgram = {
  id: number;
  programName: string;
  programDescription: string;
};
