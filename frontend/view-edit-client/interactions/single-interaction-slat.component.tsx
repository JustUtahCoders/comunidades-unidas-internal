import React from "react";
import { useCss } from "kremling";
import { CUServicesList } from "../../add-client/services.component";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";
import TimeDurationInput, {
  TimeDuration
} from "../../util/time-duration-input.component";

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
    const [duration, setDuration] = React.useState<TimeDuration>({
      hours: 0,
      minutes: 30,
      stringValue: "00:30"
    });
    const [selectedLocation, setSelectedLocation] = React.useState(
      interactionLocations.CUOffice
    );

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
            Service:
          </label>
          <div>
            <select
              ref={ref}
              value={selectedService || ""}
              onChange={evt => setSelectedService(Number(evt.target.value))}
              aria-labelledby={`provided-service-${props.interactionIndex}`}
              className="services-select"
            >
              {Object.keys(groupedServices).map(programName => (
                <optgroup label={programName} key={programName}>
                  {groupedServices[programName].map(service => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedService &&
              services.length > 0 &&
              selectedService ===
                (
                  services.find(s => s.serviceName === "Financial Coach") || {
                    id: null
                  }
                ).id && (
                <div className="caption">
                  Please add the established goals into the description field.
                </div>
              )}
          </div>
          <label id={`interaction-type-${props.interactionIndex}`}>Type:</label>
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
          <label id={`interaction-date-${props.interactionIndex}`}>Date:</label>
          <input
            type="date"
            value={dateOfInteraction}
            onChange={evt => setDateOfInteraction(evt.target.value)}
            aria-labelledby={`interaction-date-${props.interactionIndex}`}
          />
          <label id={`interaction-duration-${props.interactionIndex}`}>
            Duration:
          </label>
          <TimeDurationInput
            labelId={`interaction-duration-${props.interactionIndex}`}
            initialValue="00:30"
            setValue={handleTimeChange}
          />
          {selectedInteractionType !== "byPhone" && (
            <>
              <label id={`interaction-location-${props.interactionIndex}`}>
                Location:
              </label>
              <select
                value={selectedLocation || ""}
                onChange={evt => setSelectedLocation(evt.target.value)}
                aria-labelledby={`interaction-location-${props.interactionIndex}`}
              >
                {Object.keys(interactionLocations).map(location => (
                  <option key={location} value={location}>
                    {interactionLocations[location]}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    );

    function handleTimeChange() {}
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
  column-gap: 1.6rem;
}

& .inputs input {
  width: min-content;
}

& .inputs label {
  text-align: right;
}

& .services-select {
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

export const interactionLocations = {
  CUOffice: "CU Office",
  consulate: "Consulate",
  communityEvent: "Community Event"
};

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  interactionIndex: number;
  removeInteraction(): any;
};
