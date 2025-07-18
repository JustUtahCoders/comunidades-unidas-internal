import React, { createRef } from "react";
import PageHeader from "../../page-header.component";
import SingleClientSearchInputComponent from "../../client-search/single-client/single-client-search-input.component";
import easyFetch from "../../util/easy-fetch";
import SingleInteractionSlat, {
  InteractionInputsRef,
} from "./single-interaction-slat.component";
import { useCss } from "kremling";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import { navigate } from "@reach/router";
import UpdateInterestedServices from "./update-interested-services.component";
import { SingleClient } from "../view-client.component";
import { useForceUpdate } from "../../util/use-force-update";
import { differenceBy } from "lodash-es";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import { isServiceWithinImmigrationProgram } from "../../immigration/immigration.utils";
import { CUServicesList } from "../../add-client/services.component";
import { FullPartner } from "../../admin/partners/partners.component";

export default function AddClientInteraction(props: AddClientInteractionProps) {
  const [servicesResponse, setServicesResponse] =
    React.useState<CUServicesList>(null);
  const [partnersResponse, setPartnersResponse] = React.useState<FullPartner[]>(
    []
  );
  const [tempInteractionIds, setTempInteractionIds] = React.useState([0]);
  const [savingInteraction, setSavingInteraction] = React.useState(false);
  const interestedServicesRef = React.useRef(null);
  const clientSearchRef = React.useRef(null);
  const scope = useCss(css);
  const forceUpdate = useForceUpdate();
  const clientChanged = React.useCallback(forceUpdate, []);
  const clientId = clientSearchRef.current
    ? clientSearchRef.current.clientId
    : props.clientId;
  const userMode = React.useContext(UserModeContext);
  const [interactionRefs, setInteractionRefs] = React.useState([]);

  React.useEffect(() => {
    setInteractionRefs((oldRefs) =>
      Array(tempInteractionIds.length)
        .fill(null)
        .map((_, i) => oldRefs[i] || createRef())
    );
  }, [tempInteractionIds.length]);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/services", { signal: abortController.signal })
      .then((data) => setServicesResponse(data))
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  React.useEffect(() => {
    const ac = new AbortController();

    easyFetch("/api/partners", { signal: ac.signal })
      .then(setPartnersResponse)
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });
  }, []);

  React.useEffect(() => {
    if (savingInteraction) {
      const newIntakeServices =
        interestedServicesRef.current.getNewInterestedServices();
      const oldIntakeServices =
        interestedServicesRef.current.getOldInterestedServices();
      const intakeServicesChanged =
        newIntakeServices.length !== oldIntakeServices.length ||
        differenceBy(newIntakeServices, oldIntakeServices, "id").length > 0;

      const ac = new AbortController();

      const intakeServicesPromise = intakeServicesChanged
        ? easyFetch(`/api/clients/${clientId}`, {
            signal: ac.signal,
            method: "PATCH",
            body: {
              intakeServices: newIntakeServices.map((s) => s.id),
            },
          }).then(() => {
            if (props.refetchClient) {
              props.refetchClient();
            }
          })
        : Promise.resolve();

      Promise.all(
        interactionRefs
          .map((ref: React.RefObject<InteractionInputsRef>, i) =>
            ref.current.save(ac.signal)
          )
          .concat(intakeServicesPromise)
      )
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: "Client interactions were created",
          });
          navigate(`/clients/${clientId}/history`);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setSavingInteraction(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [savingInteraction, interactionRefs, clientId]);

  return (
    <>
      {props.isGlobalAdd && <PageHeader title="Add a client interaction" />}
      <form className="card" onSubmit={handleSubmit} {...scope}>
        {!props.isGlobalAdd && (
          <h2 style={{ marginTop: 0 }}>Add an interaction</h2>
        )}
        {props.isGlobalAdd && (
          <SingleClientSearchInputComponent
            autoFocus
            clientChanged={clientChanged}
            ref={clientSearchRef}
          />
        )}
        {tempInteractionIds.map((item, index) => (
          <SingleInteractionSlat
            inWell
            servicesResponse={servicesResponse}
            partnersResponse={partnersResponse}
            interactionIndex={index}
            removeInteraction={() => removeInteraction(item)}
            key={item}
            clientId={clientId}
            ref={interactionRefs[index]}
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
        <UpdateInterestedServices
          clientToFetch={props.client ? null : clientId}
          client={props.client}
          ref={interestedServicesRef}
        />
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
      tempInteractionIds[tempInteractionIds.length - 1] + 1,
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
      tempInteractionIds.filter((id) => id !== interactionId)
    );
  }
}

export function getTagsQuery(
  userMode: UserMode,
  serviceId: number,
  servicesResponse: CUServicesList
) {
  return userMode === UserMode.immigration &&
    isServiceWithinImmigrationProgram(servicesResponse, serviceId)
    ? "?tags=immigration"
    : "";
}

const css = `
& .add-another {
  margin: 1.6rem 0;
}

& .actions {
  display: flex;
  justify-content: center;
  margin-top: 1.6rem;
}
`;

type AddClientInteractionProps = {
  path: string;
  isGlobalAdd?: boolean;
  clientId?: string;
  client?: SingleClient;
  refetchClient?: () => any;
};
