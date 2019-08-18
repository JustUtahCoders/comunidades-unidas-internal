import React from "react";
import { LogTypeEditProps } from "../client-history/edit-log.component";
import SingleInteractionSlatComponent, {
  InteractionGetter
} from "./single-interaction-slat.component";
import { CUServicesList } from "../../add-client/services.component";
import easyFetch from "../../util/easy-fetch";
import { ProgressPlugin } from "webpack";

export default function EditClientInteraction({
  log,
  actionsRef,
  clientId
}: LogTypeEditProps) {
  const [interactionGetter, setInteractionGetter] = React.useState<
    InteractionGetter
  >(null);
  const [servicesResponse, setServicesResponse] = React.useState<
    CUServicesList
  >(null);
  const [originalInteraction, setOriginalInteraction] = React.useState(null);

  log.detailId = 1234;

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
    if (!log.detailId) {
      throw Error(
        `Cannot modify a client interaction without a client log detailId`
      );
    }

    const abortController = new AbortController();

    easyFetch(`/api/clients/${clientId}/interactions/${log.detailId}`, {
      signal: abortController.signal
    }).then(interaction => {
      setOriginalInteraction(interaction);
    });
  }, [log.detailId]);

  React.useEffect(() => {
    actionsRef.current.save = abortController => {
      return easyFetch(
        `/api/clients/${clientId}/interactions/${originalInteraction.id}`,
        {
          signal: abortController.signal,
          method: "PATCH",
          body: interactionGetter()
        }
      );
    };

    actionsRef.current.delete = abortController => {
      return easyFetch(
        `/api/clients/${clientId}/interactions/${originalInteraction.id}`,
        {
          signal: abortController.signal,
          method: "DELETE"
        }
      );
    };
  });

  if (originalInteraction && servicesResponse) {
    return (
      <SingleInteractionSlatComponent
        addInteractionGetter={(index, getter) =>
          setInteractionGetter(() => getter)
        }
        removeInteractionGetter={() => setInteractionGetter(null)}
        interactionIndex={0}
        removeInteraction={null}
        servicesResponse={servicesResponse}
        initialInteraction={originalInteraction}
      />
    );
  } else {
    return null;
  }
}
