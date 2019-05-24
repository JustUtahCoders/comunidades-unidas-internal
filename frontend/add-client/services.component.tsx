import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import agendaIconUrl from "../../icons/148705-essential-collection/svg/agenda.svg";
import { useCss } from "kremling";
import easyFetch from "../util/easy-fetch";

export default function Services(props: StepComponentProps) {
  const [services, setServices] = useState([]);
  const [checkedServices, setCheckedServices] = useState([]);
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
          <img src={agendaIconUrl} className="hint-icon" />
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
        <div>
          <div className="vertical-options">
            {services.map(service => (
              <label key={service.id}>
                <input
                  type="checkbox"
                  name="services"
                  value={service.id}
                  checked={checkedServices.some(
                    checkedService => checkedService === service.id
                  )}
                  onChange={handleChange}
                  autoFocus
                />
                <span>{service.serviceName}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.CLIENT_SOURCE, {})}
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

  function handleChange(evt) {
    const serviceId = Number(evt.target.value);
    let newCheckedServices;
    if (evt.target.checked) {
      newCheckedServices = [...checkedServices, serviceId];
    } else {
      newCheckedServices = checkedServices.filter(
        service => service.id !== serviceId
      );
    }
    setCheckedServices(newCheckedServices);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.CONFIRM, {
      intakeServices: checkedServices
    });
  }
}

const css = `
& .warning {
  font-weight: bold;
  font-style: italic;
  margin-top: .8rem;
}
`;
