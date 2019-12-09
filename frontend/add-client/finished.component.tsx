import React from "react";
import { useCss } from "kremling";
import { StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import { Link } from "@reach/router";

export default function Finished(props: StepComponentProps) {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" alt="All done icon" />
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
          {props.lead ? (
            <>
              <Link to={`/leads/${props.lead.id}`}>
                <button className="button secondary">View original lead</button>
              </Link>
              <Link to="/leads">
                <button className="button primary">Go to leads list</button>
              </Link>
            </>
          ) : (
            <button className="button primary" onClick={addAnother}>
              Add another client
            </button>
          )}
        </div>
      </div>
    </>
  );

  function addAnother() {
    props.reset();
  }
}

export const css = `
  & .actions {
    margin-left: 1rem;
  }
`;
