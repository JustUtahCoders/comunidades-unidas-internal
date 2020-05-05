import React, { FormEvent } from "react";
import { CUService, CUProgram } from "../add-client/services.component";
import { useCss } from "kremling";

export default function CUServiceInputs(props: CUServiceInputsProps) {
  const scope = useCss(css);

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
  min-width: 18rem;
}
`;
