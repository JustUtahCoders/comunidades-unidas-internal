import React from "react";
import { useCss } from "kremling";
import { CUServicesList } from "../../add-client/services.component";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";
// import TimeDurationInput, { TimeDuration } from "../../util/time-duration-input.component";

export default React.forwardRef<any, SingleClientInteractionProps>(
  function SingleClientInteraction(props, ref) {
    const scope = useCss(css);
    const [selectedService, setSelectedService] = React.useState(null);
    const [
      selectedInteractionType,
      setSelectedInteractionType
    ] = React.useState(null);
    const [dateOfInteraction, setDateOfInteraction] = React.useState(
      dayjs().format("YYYY-MM-DD")
    );
    // const [duration, setDuration] = React.useState<TimeDuration>({})

    const services = props.servicesResponse
      ? props.servicesResponse.services
      : [];

    const groupedServices = groupBy(services, "programName");

    return (
      <div className="single-client-interaction" {...scope}>
        <div className="header">
          <h3 className="interaction-number">
            #{props.interactionIndex + 1}
            {selectedService ? ` ${selectedService}` : ""}
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
          <label id={`provided-service-${props.interactionIndex}`}>
            Provided service:
          </label>
          <select
            ref={ref}
            value={selectedService || ""}
            onChange={evt => setSelectedService(evt.target.value)}
            aria-labelledby={`provided-service-${props.interactionIndex}`}
          >
            {Object.keys(groupedServices).map(programName => (
              <optgroup label={programName} key={programName}>
                {groupedServices[programName].map(service => (
                  <option key={service.id}>{service.serviceName}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <label id={`interaction-type-${props.interactionIndex}`}>
            Interaction Type:
          </label>
          <select
            value={selectedInteractionType || ""}
            onChange={evt => setSelectedInteractionType(evt.target.value)}
            aria-labelledby={`interaction-type-${props.interactionIndex}`}
          >
            {Object.keys(interactionTypes).map(interactionType => (
              <option key={interactionType} value={interactionType}>
                {interactionTypes[interactionType]}
              </option>
            ))}
          </select>
          <label id={`interaction-date-${props.interactionIndex}`}>
            Date of interaction:
          </label>
          <input
            type="date"
            value={dateOfInteraction}
            onChange={evt => setDateOfInteraction(evt.target.value)}
            aria-labelledby={`interaction-date-${props.interactionIndex}`}
          />
          {/* <TimeDurationInput  /> */}
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

& .inputs {
  display: grid;
  grid-template-columns: 1fr 3fr;
  row-gap: 1.6rem;
}

& .inputs select {
  min-width: 100%;
}
`;

export const interactionTypes = {
  inPerson: "In Person",
  byPhone: "By Phone",
  workshopTalk: "Workshop / Talk",
  oneOnOneLightTough: "One On One / Light Tough",
  consultation: "Consultation"
};

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  interactionIndex: number;
  removeInteraction(): any;
};
