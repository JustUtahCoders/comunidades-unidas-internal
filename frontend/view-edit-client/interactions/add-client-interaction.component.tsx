import React from "react";
import PageHeader from "../../page-header.component";
import ReportIssue from "../../report-issue/report-issue.component";
import SingleClientSearchInputComponent from "../../client-search/single-client/single-client-search-input.component";
import easyFetch from "../../util/easy-fetch";
import SingleInteractionSlat from "./single-interaction-slat.component";
import { useCss } from "kremling";

export default function AddClientInteraction(props: AddClientInteractionProps) {
  if (!localStorage.getItem("client-interactions")) {
    return (
      <ReportIssue
        missingFeature
        hideHeader={!props.isGlobalAdd}
        title="Add client interaction"
      />
    );
  }

  const firstInputRef = React.useRef(null);
  const [servicesResponse, setServicesResponse] = React.useState(null);
  const [numInteractions, setNumInteractions] = React.useState(1);
  const scope = useCss(css);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/services", { signal: abortController.signal })
      .then(data => setServicesResponse(data))
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  return (
    <>
      {props.isGlobalAdd && <PageHeader title="Add a client interaction" />}
      <form className="card" onSubmit={handleSubmit} {...scope}>
        {props.isGlobalAdd && (
          <SingleClientSearchInputComponent
            autoFocus
            nextThingToFocusRef={firstInputRef}
          />
        )}
        {Array(numInteractions)
          .fill(null)
          .map((item, index) => (
            <SingleInteractionSlat
              servicesResponse={servicesResponse}
              interactionIndex={index}
              removeInteraction={removeInteraction}
              key={index}
              ref={index === 0 ? firstInputRef : null}
            />
          ))}
        <div className="add-another">
          <button
            type="button"
            className="secondary"
            onClick={addAnotherInteraction}
          >
            Add another interaction
          </button>
        </div>
        <div className="actions">
          <button type="button" className="secondary" onClick={cancel}>
            Cancel
          </button>
          <button className="primary">Save</button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    alert("handleSubmit not yet implemented");
  }

  function addAnotherInteraction() {
    setNumInteractions(numInteractions + 1);
  }

  function cancel() {
    if (
      window.confirm(
        "Are you sure you want to cancel? All interactions will be lost."
      )
    ) {
      window.history.back();
    }
  }

  function removeInteraction() {
    setNumInteractions(numInteractions - 1);
  }
}

const css = `
& .add-another {
  margin: 1.6rem 0;
}

& .actions {
  display: flex;
  justify-content: center;
}
`;

type AddClientInteractionProps = {
  path: string;
  isGlobalAdd?: boolean;
};
