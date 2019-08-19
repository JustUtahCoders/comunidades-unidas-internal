import React from "react";
import PageHeader from "../../page-header.component";
import ReportIssue from "../../report-issue/report-issue.component";
import SingleClientSearchInputComponent from "../../client-search/single-client/single-client-search-input.component";
import easyFetch from "../../util/easy-fetch";
import SingleInteractionSlat, {
  InteractionGetter
} from "./single-interaction-slat.component";
import { useCss } from "kremling";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import { navigate } from "@reach/router";

export default function AddClientInteraction(props: AddClientInteractionProps) {
  const firstInputRef = React.useRef(null);
  const [servicesResponse, setServicesResponse] = React.useState(null);
  const [tempInteractionIds, setTempInteractionIds] = React.useState([0]);
  const [interactionGetters, setInteractionGetters] = React.useState<
    Array<InteractionGetter>
  >([]);
  const [savingInteraction, setSavingInteraction] = React.useState(false);
  const clientSearchRef = React.useRef(null);
  const scope = useCss(css);
  const clientId = clientSearchRef.current
    ? clientSearchRef.current.clientId
    : props.clientId;

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

  React.useEffect(() => {
    if (savingInteraction) {
      const interactions = interactionGetters.map(getter => getter());

      const abortControllers = [...Array(interactions.length)].map(
        () => new AbortController()
      );

      Promise.all(
        interactions.map(interaction =>
          easyFetch(`/api/clients/${clientId}/interactions`, {
            method: "POST",
            body: interaction
          })
        )
      )
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: "Client interactions were created"
          });
          navigate(`/clients/${clientId}/history`);
        })
        .catch(err => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setSavingInteraction(false);
        });

      return () => {
        abortControllers.forEach(ac => ac.abort());
      };
    }
  }, [savingInteraction, interactionGetters, clientId]);

  return (
    <>
      {props.isGlobalAdd && <PageHeader title="Add a client interaction" />}
      <form className="card" onSubmit={handleSubmit} {...scope}>
        {props.isGlobalAdd && (
          <SingleClientSearchInputComponent
            autoFocus
            nextThingToFocusRef={firstInputRef}
            ref={clientSearchRef}
          />
        )}
        {tempInteractionIds.map((item, index) => (
          <SingleInteractionSlat
            inWell
            addInteractionGetter={(index, getter) => {
              const newGetters = [...interactionGetters];
              newGetters[index] = getter;
              setInteractionGetters(newGetters);
            }}
            removeInteractionGetter={index => {
              const newGetters = interactionGetters.filter(
                (g, i) => i !== index
              );
              setInteractionGetters(newGetters);
            }}
            servicesResponse={servicesResponse}
            interactionIndex={index}
            removeInteraction={() => removeInteraction(item)}
            key={item}
            ref={index === 0 ? firstInputRef : null}
          />
        ))}
        <div className="add-another">
          <button
            type="button"
            className="secondary"
            onClick={addAnotherInteraction}
            disabled={savingInteraction}
          >
            Add another interaction
          </button>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={cancel}
            disabled={savingInteraction}
          >
            Cancel
          </button>
          <button className="primary">Save</button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setSavingInteraction(true);
  }

  function addAnotherInteraction() {
    setTempInteractionIds([
      ...tempInteractionIds,
      tempInteractionIds[tempInteractionIds.length - 1] + 1
    ]);
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

  function removeInteraction(interactionId) {
    setTempInteractionIds(
      tempInteractionIds.filter(id => id !== interactionId)
    );
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
  clientId?: string;
};
