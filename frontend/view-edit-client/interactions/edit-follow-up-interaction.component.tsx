import { useCss } from "kremling";
import { noop } from "lodash-es";
import React, {
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import PinwheelLoader from "../../util/pinwheel-loader.component";
import { LogTypeEditProps } from "../client-history/edit-log.component";
import FollowUpInteractionInputs, {
  FollowUpInputsRef,
} from "./follow-up-interaction-inputs.component";
import { css, InteractionInputsRef } from "./single-interaction-slat.component";

function EditFollowUpInteraction(props: LogTypeEditProps) {
  const [servicesResponse, setServicesResponse] = useState(null);
  const [existingFollowUp, setExistingFollowUp] = useState(null);

  const inputsRef = useRef<FollowUpInputsRef>(null);

  useEffect(() => {
    const ac = new AbortController();

    easyFetch(`/api/services`, {
      signal: ac.signal,
    })
      .then(setServicesResponse)
      .catch(handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    easyFetch(
      `/api/clients/${props.clientId}/follow-ups/${props.log.detailId}`,
      {
        signal: ac.signal,
      }
    )
      .then(setExistingFollowUp)
      .catch(handlePromiseError);

    return () => ac.abort();
  }, [props.log.detailId]);

  const scope = useCss(css);

  useImperativeHandle(props.actionsRef, () => ({
    save(ac: AbortController) {
      const finalFollowUp = inputsRef.current.getFollowUp();
      delete finalFollowUp.services;

      return easyFetch(
        `/api/clients/${props.clientId}/follow-ups/${existingFollowUp.id}`,
        {
          signal: ac.signal,
          method: "PATCH",
          body: finalFollowUp,
        }
      );
    },
    delete(ac: AbortController) {
      return Promise.reject(
        `Error: Deleting follow ups is not yet implemented`
      );
    },
  }));

  useEffect(() => {
    if (existingFollowUp && servicesResponse && !existingFollowUp.services) {
      setExistingFollowUp({
        ...existingFollowUp,
        services: existingFollowUp.serviceIds.map((serviceId) =>
          servicesResponse.services.find((s) => s.id === serviceId)
        ),
      });
    }
  }, [existingFollowUp, servicesResponse]);

  if (existingFollowUp && servicesResponse && existingFollowUp.services) {
    return (
      <div {...scope} className="single-client-interaction">
        <div className="inputs">
          <FollowUpInteractionInputs
            ref={inputsRef}
            clientId={props.clientId}
            setName={noop}
            interactionIndex={0}
            partnersResponse={null}
            servicesResponse={servicesResponse}
            initialFollowUp={existingFollowUp}
          />
        </div>
      </div>
    );
  } else {
    return <PinwheelLoader />;
  }
}

EditFollowUpInteraction.wideModal = true;

export default EditFollowUpInteraction;
