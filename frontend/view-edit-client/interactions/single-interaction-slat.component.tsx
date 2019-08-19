import React from "react";
import { useCss, a } from "kremling";
import { CUServicesList, CUService } from "../../add-client/services.component";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";
import TimeDurationInput, {
  TimeDuration
} from "../../util/time-duration-input.component";
import FullRichTextEditorComponent from "../../rich-text/full-rich-text-editor.component";

export default React.forwardRef<any, SingleClientInteractionProps>(
  function SingleClientInteraction(props, ref) {
    const scope = useCss(css);
    const [selectedService, setSelectedService] = React.useState<CUService>(
      null
    );
    const [
      selectedInteractionType,
      setSelectedInteractionType
    ] = React.useState(
      props.initialInteraction
        ? props.initialInteraction.interactionType
        : "inPerson"
    );
    const [dateOfInteraction, setDateOfInteraction] = React.useState(
      (props.initialInteraction
        ? dayjs(props.initialInteraction.dateOfInteraction)
        : dayjs()
      ).format("YYYY-MM-DD")
    );
    const [duration, setDuration] = React.useState<TimeDuration>(
      props.initialInteraction
        ? {
            stringValue: props.initialInteraction.duration,
            hours: null,
            minutes: null
          }
        : {
            hours: 0,
            minutes: 30,
            stringValue: "00:30:00"
          }
    );
    const [selectedLocation, setSelectedLocation] = React.useState(
      props.initialInteraction
        ? props.initialInteraction.location
        : interactionLocations.CUOffice
    );
    const descrRef = React.useRef(null);

    const services = props.servicesResponse
      ? props.servicesResponse.services
      : [];

    const groupedServices = groupBy(services, "programName");

    React.useEffect(() => {
      props.addInteractionGetter(props.interactionIndex, interactionGetter);
      return () => props.removeInteractionGetter(props.interactionIndex);

      function interactionGetter() {
        return {
          serviceId: selectedService ? selectedService.id : null,
          interactionType: selectedInteractionType,
          dateOfInteraction,
          duration: duration.stringValue,
          location: selectedLocation,
          description: descrRef.current.getHTML()
        };
      }
    }, [
      selectedService,
      selectedInteractionType,
      dateOfInteraction,
      duration,
      selectedLocation,
      descrRef.current
    ]);

    React.useEffect(() => {
      if (selectedInteractionType === "byPhone") {
        setSelectedLocation("CUOffice");
      }
    }, [selectedInteractionType]);

    React.useEffect(() => {
      if (props.servicesResponse && !selectedService) {
        const serviceId = props.initialInteraction
          ? props.initialInteraction.serviceId
          : null;
        setSelectedService(
          serviceId
            ? props.servicesResponse.services.find(s => s.id === serviceId)
            : null
        );
      }
    }, [props.servicesResponse, props.initialInteraction, selectedService]);

    return (
      <div
        className={a("single-client-interaction").m("in-well", props.inWell)}
        {...scope}
      >
        <div className="header">
          {props.inWell && (
            <h3 className="interaction-number">
              #{props.interactionIndex + 1}
              {selectedService ? ` ${selectedService.serviceName}` : ""}
            </h3>
          )}
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
              value={selectedService ? selectedService.id : ""}
              onChange={evt =>
                setSelectedService(
                  services.find(s => s.id === Number(evt.target.value))
                )
              }
              aria-labelledby={`provided-service-${props.interactionIndex}`}
              className="services-select"
              name={`provided-service-${props.interactionIndex}`}
              required
            >
              <option value="" disabled hidden>
                Choose here
              </option>
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
              selectedService.serviceName === "Financial Coach" && (
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
            required
          >
            <option value="" disabled hidden>
              Choose here
            </option>
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
            required
          />
          <label id={`interaction-duration-${props.interactionIndex}`}>
            Duration:
          </label>
          <TimeDurationInput
            labelId={`interaction-duration-${props.interactionIndex}`}
            duration={duration}
            setDuration={setDuration}
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
                required
              >
                <option value="" disabled hidden>
                  Choose here
                </option>
                {Object.keys(interactionLocations).map(location => (
                  <option key={location} value={location}>
                    {interactionLocations[location]}
                  </option>
                ))}
              </select>
            </>
          )}
          <label id={`interaction-description-${props.interactionIndex}`}>
            Description:
          </label>
          <FullRichTextEditorComponent
            ref={descrRef}
            placeholder="Describe this interaction with the client"
            initialHTML={
              props.initialInteraction
                ? props.initialInteraction.description
                : null
            }
          />
        </div>
      </div>
    );

    function handleTimeChange(newDuration) {
      setDuration(newDuration);
    }
  }
);

const css = `
& .single-client-interaction {
  padding: .8rem .6rem;
  margin-top: 1.6rem;
}

& .single-client-interaction.in-well {
  background-color: var(--colored-well);
  border-radius: .5rem;
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
  align-items: center;
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

& .in-well button.icon:hover {
  background-color: #ffd08a;
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
  addInteractionGetter(index: number, getter: InteractionGetter): any;
  removeInteractionGetter(index: number): any;
  inWell?: boolean;
  initialInteraction?: InteractionSlatData;
};

export type InteractionGetter = () => InteractionSlatData;

export type InteractionSlatData = {
  serviceId: number;
  interactionType: string;
  dateOfInteraction: string;
  duration: string;
  location: string;
  description: string;
};
