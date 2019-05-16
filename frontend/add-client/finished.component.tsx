import React from "react";
import { StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";

export default function Finished(props: StepComponentProps) {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          {props.clientState.firstName} {props.clientState.lastName} is now in
          the system! Their client id is {props.clientState.id}.
        </div>
        <div className="actions">
          <button className="primary" onClick={addAnother}>
            Add another client
          </button>
        </div>
      </div>
    </>
  );

  function addAnother() {
    props.reset();
  }
}
