import React from "react";
import { StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import { Link } from "@reach/router";

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
          <Link
            className="button secondary"
            to={`/clients/${props.clientState.id}`}
          >
            View {props.clientState.firstName} {props.clientState.lastName}
          </Link>
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
