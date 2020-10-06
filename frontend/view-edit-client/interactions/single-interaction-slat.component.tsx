import React from "react";
import { useCss, a } from "kremling";
import { CUServicesList, CUService } from "../../add-client/services.component";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";
import TimeDurationInput, {
  TimeDuration,
} from "../../util/time-duration-input.component";
import FullRichTextEditorComponent from "../../rich-text/full-rich-text-editor.component";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import {
  FullPartner,
  PartnerService,
} from "../../admin/partners/partners.component";

export default React.forwardRef<any, SingleClientInteractionProps>(
  function SingleClientInteraction(props, ref) {
    const scope = useCss(css);
    const [selectedService, setSelectedService] = React.useState<AnyService>(
      null
    );
    const [
      selectedInteractionType,
      setSelectedInteractionType,
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
            minutes: null,
          }
        : {
            hours: 0,
            minutes: 30,
            stringValue: "00:30:00",
          }
    );
    const [selectedLocation, setSelectedLocation] = React.useState(
      props.initialInteraction ? props.initialInteraction.location : "CUOffice"
    );
    const descrRef = React.useRef(null);

    const services = props.servicesResponse
      ? props.servicesResponse.services
      : [];

    const groupedServices = groupBy(services, "programName");
    const userMode = React.useContext(UserModeContext);
    if (userMode.userMode === UserMode.normal) {
      delete groupedServices.Immigration;
    }

    const partnerServices = props.partnersResponse.reduce((result, partner) => {
      return result.concat(...partner.services);
    }, []);

    const partnerServiceSelected =
      selectedService && selectedService.type === "Partner";

    React.useEffect(() => {
      const getter = partnerServiceSelected
        ? referralGetter
        : interactionGetter;
      props.addInteractionGetter(props.interactionIndex, getter);
      return () => props.removeInteractionGetter(props.interactionIndex);

      function referralGetter() {
        const now = dayjs();
        const isToday =
          dayjs(dateOfInteraction).format("YYYY-MM-DD") ===
          dayjs().format("YYYY-MM-DD");
        return {
          partnerServiceId: (selectedService.service as PartnerService).id,
          referralDate: isToday
            ? dayjs().toISOString()
            : dayjs(dateOfInteraction + now.format(" hh:mm")).toISOString(),
        };
      }

      function interactionGetter() {
        let description = descrRef.current.getHTML();
        if (description.trim().length === 0) {
          description = null;
        }

        return {
          serviceId: selectedService ? selectedService.service.id : null,
          interactionType: selectedInteractionType,
          dateOfInteraction,
          duration: duration.stringValue,
          location: selectedLocation,
          description,
        };
      }
    }, [
      selectedService,
      selectedInteractionType,
      dateOfInteraction,
      duration,
      selectedLocation,
      descrRef.current,
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
            ? {
                type: ServiceType.CU,
                service: props.servicesResponse.services.find(
                  (s) => s.id === serviceId
                ),
              }
            : null
        );
      }
    }, [props.servicesResponse, props.initialInteraction, selectedService]);

    React.useEffect(() => {
      if (!selectedService) {
        return;
      } else if (selectedService.type === ServiceType.CU) {
        if (selectedService.service.defaultInteractionLocation) {
          setSelectedLocation(
            selectedService.service.defaultInteractionLocation
          );
        }

        if (selectedService.service.defaultInteractionType) {
          setSelectedInteractionType(
            selectedService.service.defaultInteractionType
          );
        }

        if (selectedService.service.defaultInteractionDuration) {
          setDuration({
            stringValue: selectedService.service.defaultInteractionDuration,
            hours: null,
            minutes: null,
          });
        }
      }
    }, [selectedService]);

    return (
      <div
        className={a("single-client-interaction").m("in-well", props.inWell)}
        {...scope}
      >
        <div className="header">
          {props.inWell && (
            <h3 className="interaction-number">
              #{props.interactionIndex + 1}
              {selectedService ? ` ${getName(selectedService)}` : ""}
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
              value={
                selectedService
                  ? selectedService.type + selectedService.service.id
                  : ""
              }
              onChange={(evt) => {
                if (evt.target.value.startsWith("Partner")) {
                  const serviceId = Number(
                    evt.target.value.slice("Partner".length)
                  );
                  setSelectedService({
                    type: "Partner",
                    service: partnerServices.find((ps) => ps.id === serviceId),
                  });
                } else {
                  const serviceId = Number(evt.target.value.slice("CU".length));
                  setSelectedService({
                    type: "CU",
                    service: services.find((s) => s.id === serviceId),
                  });
                }
              }}
              aria-labelledby={`provided-service-${props.interactionIndex}`}
              className="services-select"
              name={`provided-service-${props.interactionIndex}`}
              required
            >
              <option value="" disabled hidden>
                Choose here
              </option>
              {props.partnersResponse.map((partner) => (
                <optgroup label={partner.name + " (Referral)"} key={partner.id}>
                  {partner.services.map((partnerService) => (
                    <option
                      key={partnerService.id}
                      value={"Partner" + partnerService.id}
                    >
                      {partnerService.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              {Object.keys(groupedServices).map((programName) => (
                <optgroup label={programName} key={programName}>
                  {groupedServices[programName].map((service) => (
                    <option key={service.id} value={"CU" + service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedService &&
              services.length > 0 &&
              selectedService.type === "CU" &&
              selectedService.service.serviceName === "Financial Coach" && (
                <div className="caption">
                  Please add the established goals into the description field.
                </div>
              )}
          </div>
          {!partnerServiceSelected && (
            <>
              <label id={`interaction-type-${props.interactionIndex}`}>
                Type:
              </label>
              <select
                value={selectedInteractionType || ""}
                onChange={(evt) => setSelectedInteractionType(evt.target.value)}
                aria-labelledby={`interaction-type-${props.interactionIndex}`}
                required
              >
                <option value="" disabled hidden>
                  Choose here
                </option>
                {Object.keys(InteractionType).map((interactionType) => (
                  <option key={interactionType} value={interactionType}>
                    {InteractionType[interactionType]}
                  </option>
                ))}
              </select>
            </>
          )}
          <label id={`interaction-date-${props.interactionIndex}`}>Date:</label>
          <input
            type="date"
            value={dateOfInteraction}
            onChange={(evt) => setDateOfInteraction(evt.target.value)}
            aria-labelledby={`interaction-date-${props.interactionIndex}`}
            required
          />
          {!partnerServiceSelected && (
            <>
              <label id={`interaction-duration-${props.interactionIndex}`}>
                Duration:
              </label>
              <TimeDurationInput
                labelId={`interaction-duration-${props.interactionIndex}`}
                duration={duration}
                setDuration={setDuration}
              />
            </>
          )}
          {!partnerServiceSelected && selectedInteractionType !== "byPhone" && (
            <>
              <label id={`interaction-location-${props.interactionIndex}`}>
                Location:
              </label>
              <select
                value={selectedLocation || ""}
                onChange={(evt) => setSelectedLocation(evt.target.value)}
                aria-labelledby={`interaction-location-${props.interactionIndex}`}
                required
              >
                <option value="" disabled hidden>
                  Choose here
                </option>
                {Object.keys(InteractionLocation).map((location) => (
                  <option key={location} value={location}>
                    {InteractionLocation[location]}
                  </option>
                ))}
              </select>
            </>
          )}
          {!partnerServiceSelected && (
            <>
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
            </>
          )}
        </div>
      </div>
    );
  }
);

function getName(service: AnyService) {
  if (service.type === "CU") {
    return service.service.serviceName;
  } else {
    return service.service.name + " (Referral)";
  }
}

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

export enum InteractionType {
  inPerson = "In Person",
  byPhone = "By Phone",
  workshopTalk = "Workshop / Talk",
  oneOnOneLightTouch = "One On One / Light Touch",
  consultation = "Consultation",
}

export enum InteractionLocation {
  CUOffice = "CU Office",
  consulateOffice = "Consulate Office",
  communityEvent = "Community Event",
}

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  partnersResponse: FullPartner[];
  interactionIndex: number;
  removeInteraction(): any;
  addInteractionGetter(index: number, getter: InteractionGetter): any;
  removeInteractionGetter(index: number): any;
  inWell?: boolean;
  initialInteraction?: InteractionSlatData;
};

export type InteractionGetter = () => InteractionSlatData | Referral;

export type Referral = {
  partnerServiceId: number;
  referralDate: string;
};

export type InteractionSlatData = {
  serviceId: number;
  interactionType: string;
  dateOfInteraction: string;
  duration: string;
  location: string;
  description: string;
};

enum ServiceType {
  CU = "CU",
  Partner = "Partner",
}

type CUServiceType = {
  type: "CU";
  service: CUService;
};

type PartnerServiceType = {
  type: "Partner";
  service: PartnerService;
};

type AnyService = CUServiceType | PartnerServiceType;
