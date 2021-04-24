import React, { FormEvent } from "react";
import { CUService, CUProgram } from "../add-client/services.component";
import { useCss } from "kremling";
import { isEmpty } from "lodash-es";
import {
  InteractionType,
  InteractionLocation,
} from "../view-edit-client/interactions/single-interaction-slat.component";
import TimeDurationInput, {
  TimeDuration,
} from "../util/time-duration-input.component";
import CustomQuestionInputs from "./custom-question-inputs.component";

export default function CUServiceInputs(props: CUServiceInputsProps) {
  const scope = useCss(css);
  const [lineItemRate, setLineItemRate] = React.useState(
    props.service.defaultLineItemRate
      ? props.service.defaultLineItemRate.toFixed(2)
      : ""
  );
  const [
    defaultInteractionDuration,
    setDefaultInteractionDuration,
  ] = React.useState<TimeDuration>({
    stringValue: props.service.defaultInteractionDuration,
    hours: null,
    minutes: null,
  });

  React.useEffect(() => {
    if (
      !isEmpty(lineItemRate) &&
      Number(lineItemRate) !== props.service.defaultLineItemRate
    ) {
      props.setService({
        ...props.service,
        defaultLineItemRate: Number(lineItemRate),
      });
    }
  }, [lineItemRate, props.service.defaultLineItemRate]);

  React.useEffect(() => {
    if (
      defaultInteractionDuration.stringValue !==
      props.service.defaultInteractionDuration
    ) {
      props.setService({
        ...props.service,
        defaultInteractionDuration: defaultInteractionDuration.stringValue,
      });
    }
  }, [
    defaultInteractionDuration.stringValue,
    props.service.defaultInteractionDuration,
  ]);

  return (
    <form onSubmit={props.handleSubmit} ref={props.formRef} {...scope}>
      <div className="form-group">
        <label htmlFor="service-name">Service name:</label>
        <input
          type="text"
          value={props.service.serviceName}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              serviceName: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="service-description">Service description:</label>
        <input
          type="text"
          value={props.service.serviceDescription}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              serviceDescription: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="service-program">Part of Program:</label>
        <select
          value={props.service.programId}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              programId: Number(evt.target.value),
            })
          }
        >
          {props.programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.programName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="service-active">Is Active:</label>
        <input
          id="service-active"
          type="checkbox"
          checked={props.service.isActive}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              isActive: evt.target.checked,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-name">Line Item Name:</label>
        <input
          id="line-item-name"
          type="text"
          value={props.service.defaultLineItemName || ""}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              defaultLineItemName: isEmpty(evt.target.value)
                ? null
                : evt.target.value,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-description">Line Item Description:</label>
        <input
          id="line-item-description"
          type="text"
          value={props.service.defaultLineItemDescription || ""}
          onChange={(evt) =>
            props.setService({
              ...props.service,
              defaultLineItemDescription: isEmpty(evt.target.value)
                ? null
                : evt.target.value,
            })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="line-item-rate">Line Item Rate:</label>
        <input
          id="line-item-rate"
          type="number"
          value={lineItemRate}
          onChange={(evt) => setLineItemRate(evt.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="interaction-type">Interaction Type:</label>
        <select
          id="interaction-type"
          value={props.service.defaultInteractionType || ""}
          onChange={(evt) => {
            props.setService({
              ...props.service,
              defaultInteractionType: evt.target.value as InteractionType,
            });
          }}
        >
          <option value="">None</option>
          {Object.keys(InteractionType).map((interactionType) => (
            <option key={interactionType} value={interactionType}>
              {InteractionType[interactionType]}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="interaction-location">Interaction Location:</label>
        <select
          id="interaction-location"
          value={props.service.defaultInteractionLocation || ""}
          onChange={(evt) => {
            props.setService({
              ...props.service,
              defaultInteractionLocation: evt.target
                .value as InteractionLocation,
            });
          }}
        >
          <option value="">None</option>
          {Object.keys(InteractionLocation).map((interactionLocation) => (
            <option key={interactionLocation} value={interactionLocation}>
              {InteractionLocation[interactionLocation]}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label id="interaction-duration">Interaction Duration:</label>
        <TimeDurationInput
          labelId="interaction-duration"
          duration={defaultInteractionDuration}
          setDuration={(duration) => {
            setDefaultInteractionDuration(duration);
          }}
        />
      </div>
      <CustomQuestionInputs
        questions={props.service.questions}
        setQuestions={(questions) =>
          props.setService({ ...props.service, questions })
        }
        serviceId={props.service.id}
      />
    </form>
  );
}

type CUServiceInputsProps = {
  service: CUService;
  setService(service: CUService): any;
  handleSubmit(evt: FormEvent): any;
  formRef: React.RefObject<HTMLFormElement>;
  programs: CUProgram[];
};

const css = `
& .form-group label {
  display: inline-block;
  margin: 1.6rem;
  min-width: 20rem;
}
`;
