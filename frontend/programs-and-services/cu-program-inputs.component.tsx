import React, { FormEvent } from "react";
import { useCss } from "kremling";
import { CUProgram } from "../add-client/services.component";

export default function CUProgramInputs(props: CUProgramInputsProps) {
  const scope = useCss(css);

  return (
    <form ref={props.formRef} onSubmit={props.handleSubmit} {...scope}>
      <div className="form-group">
        <label htmlFor="program-name">Program Name:</label>
        <input
          id="program-name"
          type="text"
          value={props.program.programName}
          onChange={(evt) =>
            props.setProgram({
              ...props.program,
              programName: evt.target.value,
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="program-description">Program Description:</label>
        <input
          id="program-description"
          type="text"
          value={props.program.programDescription}
          onChange={(evt) =>
            props.setProgram({
              ...props.program,
              programDescription: evt.target.value,
            })
          }
          required
        />
      </div>
    </form>
  );
}

type CUProgramInputsProps = {
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit(evt: FormEvent): any;
  program: CUProgram;
  setProgram(program: CUProgram): void;
};

const css = `
& .form-group label {
  display: inline-block;
  margin: 1.6rem;
  min-width: 20rem;
}
`;
