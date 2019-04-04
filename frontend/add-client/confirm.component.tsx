import React from "react";
import { Step, StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";

export default function Finished(props: StepComponentProps) {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Ok. Ready to save {props.clientState.firstName}{" "}
          {props.clientState.lastName} to database.
        </div>
      </div>
      <div>
        <div className="actions">
          <button type="submit" className="primary" onClick={handleSubmit}>
            Confirm
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.ADD_DEMOGRAPHICS)}
          >
            Go back
          </button>
        </div>
      </div>
    </>
  );

  function handleSubmit(evt) {
    fetch("/api/add-client/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientState: props.clientState
      })
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        if (data.affectedRows >= 1) {
          alert("Client has been added to database!");
          addAnother();
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  function addAnother() {
    props.reset();
  }
}
