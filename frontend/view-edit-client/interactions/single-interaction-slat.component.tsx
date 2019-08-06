import React from "react";
import { useCss } from "kremling";
import { CUServicesList, CUService } from "../../add-client/services.component";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";
import TimeDurationInput from "../../util/time-duration-input.component";

export default React.forwardRef<any, SingleClientInteractionProps>(
  function SingleClientInteraction(props, ref) {
    const scope = useCss(css);
    const [selectedService, setSelectedService] = React.useState<CUService>(
      null
    );
    const [interactionDate, setInteractionDate] = React.useState(
      dayjs().format("YYYY-MM-DD")
    );
    const [duration, setDuration] = React.useState({});

    const services = props.servicesResponse
      ? props.servicesResponse.services
      : [];

    const groupedServices = groupBy(services, "programName");

    console.log("duration", duration);

    return (
      <div className="single-client-interaction" {...scope}>
        <div className="header">
          <h3 className="interaction-number">
            #{props.interactionIndex + 1}{" "}
            {selectedService ? selectedService.serviceName : "(No service yet)"}
          </h3>
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
          <div>
            <label id={`interaction-service-${props.interactionIndex}`}>
              Service provided:{" "}
            </label>
            <select
              ref={ref}
              value={selectedService ? selectedService.id : ""}
              onChange={evt =>
                setSelectedService(
                  services.find(
                    service => service.id === Number(evt.target.value)
                  )
                )
              }
              aria-labelledby={`interaction-service-${props.interactionIndex}`}
              required
            >
              {Object.entries(groupedServices).map(
                ([programName, services]) => (
                  <optgroup key={programName} label={programName}>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.serviceName}
                      </option>
                    ))}
                  </optgroup>
                )
              )}
            </select>
          </div>
          <div>
            <label id={`interaction-date-${props.interactionIndex}`}>
              Date of service:
            </label>
            <input
              type="date"
              required
              value={interactionDate}
              onChange={evt => setInteractionDate(evt.target.value)}
            />
          </div>
          <div>
            <TimeDurationInput
              initialValue="00:30:00"
              index={props.interactionIndex}
              setValue={setDuration}
              required
            />
          </div>
        </div>
      </div>
    );
  }
);

const css = `
& .single-client-interaction {
  padding: .8rem .6rem;
  background-color: var(--colored-well);
  border-radius: .5rem;
  margin-top: 1.6rem;
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

& .inputs > * {
  display: flex;
  align-items: center;
  margin: .4rem 0;
}

& .inputs label {
  margin-right: 1.6rem;
}
`;

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  interactionIndex: number;
  removeInteraction(): any;
};
