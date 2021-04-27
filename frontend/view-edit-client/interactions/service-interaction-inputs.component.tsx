import React, { useEffect, useImperativeHandle } from "react";
import {
  CUCustomQuestion,
  CUCustomQuestionType,
  CUService,
} from "../../add-client/services.component";
import {
  InteractionInputsRef,
  InteractionInputsProps,
  InteractionType,
  InteractionLocation,
} from "./single-interaction-slat.component";
import { groupBy } from "lodash-es";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import dayjs from "dayjs";
import TimeDurationInput, {
  TimeDuration,
} from "../../util/time-duration-input.component";
import FullRichTextEditorComponent from "../../rich-text/full-rich-text-editor.component";
import easyFetch from "../../util/easy-fetch";
import { getTagsQuery } from "./add-client-interaction.component";
import { CUObjectAudit } from "../invoices/edit-invoice.component";
import CustomNumber from "./custom-question-inputs/custom-number";
import CustomText from "./custom-question-inputs/custom-text";
import CustomBoolean from "./custom-question-inputs/custom-boolean";
import CustomDate from "./custom-question-inputs/custom-date";
import CustomSelect from "./custom-question-inputs/custom-select";

const CustomQuestionInputs = {
  [CUCustomQuestionType.number]: CustomNumber,
  [CUCustomQuestionType.text]: CustomText,
  [CUCustomQuestionType.boolean]: CustomBoolean,
  [CUCustomQuestionType.date]: CustomDate,
  [CUCustomQuestionType.select]: CustomSelect,
};

const ServiceInteractionInputs = React.forwardRef<
  InteractionInputsRef,
  InteractionInputsProps
>((props, ref) => {
  const [selectedService, setSelectedService] = React.useState<CUService>(null);
  const services = props.servicesResponse
    ? props.servicesResponse.services
    : [];
  const groupedServices = groupBy(services, "programName");
  const [
    selectedInteractionType,
    setSelectedInteractionType,
  ] = React.useState<string>(
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

  const userMode = React.useContext(UserModeContext);
  if (userMode.userMode === UserMode.normal) {
    delete groupedServices.Immigration;
  }

  const customQuestionRefs = React.useRef({});

  useImperativeHandle(ref, () => ({
    save(signal, options = {}) {
      let description = descrRef.current.getHTML();
      if (description.trim().length === 0) {
        description = null;
      }

      const interaction = {
        serviceId: selectedService ? selectedService.id : null,
        interactionType: selectedInteractionType,
        dateOfInteraction,
        duration: duration.stringValue,
        location: selectedLocation,
        description,
        customQuestions: selectedService.questions.map((q) => {
          const ref = customQuestionRefs.current[q.id];
          return ref.getAnswer();
        }),
      };

      const apiPath = options.edit
        ? `/api/clients/${props.clientId}/interactions/${props.initialInteraction.id}`
        : `/api/clients/${props.clientId}/interactions`;
      const apiUrl =
        apiPath +
        getTagsQuery(
          userMode.userMode,
          interaction.serviceId,
          props.servicesResponse
        );

      return easyFetch(apiUrl, {
        method: options.edit ? "PATCH" : "POST",
        body: interaction,
        signal,
      });
    },
  }));

  useEffect(() => {
    props.setName(selectedService ? selectedService.serviceName : "");
  }, [selectedService, props.setName]);

  React.useEffect(() => {
    if (selectedInteractionType === InteractionType.byPhone) {
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
          ? props.servicesResponse.services.find((s) => s.id === serviceId)
          : props.servicesResponse.services[0]
      );
    }
  }, [props.servicesResponse, selectedService]);

  React.useEffect(() => {
    if (!selectedService || props.initialInteraction) {
      return;
    } else {
      if (selectedService.defaultInteractionLocation) {
        setSelectedLocation(selectedService.defaultInteractionLocation);
      }

      if (selectedService.defaultInteractionType) {
        setSelectedInteractionType(selectedService.defaultInteractionType);
      }

      if (selectedService.defaultInteractionDuration) {
        setDuration({
          stringValue: selectedService.defaultInteractionDuration,
          hours: null,
          minutes: null,
        });
      }
    }
  }, [selectedService]);

  return (
    <>
      <label id={`provided-service-${props.interactionIndex}`}>Service:</label>
      <div>
        <select
          value={"CU" + (selectedService ? selectedService.id : "")}
          onChange={(evt) => {
            const serviceId = Number(evt.target.value.slice("CU".length));
            setSelectedService(services.find((s) => s.id === serviceId));
          }}
          aria-labelledby={`provided-service-${props.interactionIndex}`}
          className="services-select"
          name={`provided-service-${props.interactionIndex}`}
          required
        >
          <option value="" disabled hidden>
            Choose here
          </option>
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
          selectedService.serviceName === "Financial Coach" && (
            <div className="caption">
              Please add the established goals into the description field.
            </div>
          )}
      </div>
      <label id={`interaction-type-${props.interactionIndex}`}>Method:</label>
      <select
        value={selectedInteractionType || ""}
        onChange={(evt) =>
          setSelectedInteractionType(evt.target.value as InteractionType)
        }
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
      <label id={`interaction-date-${props.interactionIndex}`}>Date:</label>
      <input
        type="date"
        value={dateOfInteraction}
        onChange={(evt) => setDateOfInteraction(evt.target.value)}
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
      {selectedInteractionType !== InteractionType.byPhone && (
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
      {selectedService &&
        selectedService.questions.map((question) => {
          const Input = CustomQuestionInputs[question.type];
          const initialAnswer = props.initialInteraction
            ? props.initialInteraction.customQuestions.find(
                (q) => q.questionId === question.id
              )
            : null;

          return (
            <React.Fragment key={question.id}>
              <label
                htmlFor={`question-${props.interactionIndex}-${question.id}`}
              >
                {question.label}
              </label>
              {/* @ts-ignore */}
              <Input
                ref={(r) => (customQuestionRefs.current[question.id] = r)}
                question={question}
                initialAnswer={initialAnswer ? initialAnswer.answer : null}
              />
            </React.Fragment>
          );
        })}
      <label id={`interaction-description-${props.interactionIndex}`}>
        Description:
      </label>
      <FullRichTextEditorComponent
        ref={descrRef}
        placeholder="Describe this interaction with the client"
      />
    </>
  );
});

export default ServiceInteractionInputs;

export type ClientInteraction = {
  dateOfInteraction: string;
  description: null;
  duration: string;
  id: number;
  interactionType: string;
  isDeleted: boolean;
  location: string;
  redacted: boolean;
  serviceId: number;
  createdBy: CUObjectAudit;
  lastUpdatedBy: CUObjectAudit;
  customQuestions: AnsweredCustomQuestion[];
};

export type AnsweredCustomQuestion = {
  id: number;
  questionId: number;
  answer: number | string | boolean;
};

export type CustomQuestionInputProps = {
  question: CUCustomQuestion;
  initialAnswer: string | number | boolean;
};

export type CustomQuestionInputRef = {
  getAnswer(): ClientInteractionCustomQuestionAnswer;
};

export type ClientInteractionCustomQuestionAnswer = {
  questionId: number;
  answer: string | number | boolean;
};
