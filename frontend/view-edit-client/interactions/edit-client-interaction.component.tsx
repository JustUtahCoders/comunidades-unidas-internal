import React from "react";
import { LogTypeEditProps } from "../client-history/edit-log.component";
import SingleInteractionSlatComponent, {
  InteractionGetter,
} from "./single-interaction-slat.component";
import { CUServicesList } from "../../add-client/services.component";
import easyFetch from "../../util/easy-fetch";
import { UserModeContext } from "../../util/user-mode.context";
import dayjs from "dayjs";

export default function EditClientInteraction({
  log,
  actionsRef,
  clientId,
  notEditable,
}: LogTypeEditProps) {
  const [interactionGetter, setInteractionGetter] = React.useState<
    InteractionGetter
  >(null);

  const [servicesResponse, setServicesResponse] = React.useState<
    CUServicesList
  >(null);

  const [originalInteraction, setOriginalInteraction] = React.useState(null);

  const { userMode } = React.useContext(UserModeContext);

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
    if (!log.detailId) {
      throw Error(
        `Cannot modify a client interaction without a client log detailId`
      );
    }

    const abortController = new AbortController();

    easyFetch(
      `/api/clients/${clientId}/interactions/${log.detailId}${
        userMode === "immigration" ? "?tags=immigration" : ""
      }`,
      {
        signal: abortController.signal,
      }
    ).then((interaction) => {
      setOriginalInteraction(interaction);
      if (interaction.redacted) {
        notEditable();
      }
    });
  }, [log.detailId]);

  React.useEffect(() => {
    actionsRef.current.save = (abortController) => {
      return easyFetch(
        `/api/clients/${clientId}/interactions/${originalInteraction.id}`,
        {
          signal: abortController.signal,
          method: "PATCH",
          body: interactionGetter(),
        }
      );
    };

    actionsRef.current.delete = (abortController) => {
      return easyFetch(
        `/api/clients/${clientId}/interactions/${originalInteraction.id}`,
        {
          signal: abortController.signal,
          method: "DELETE",
        }
      );
    };
  });

  if (originalInteraction) {
    if (originalInteraction.redacted) {
      return (
        <div>
          This is an immigration-related interaction that has been redacted for
          all non-immigration staff members. The interaction was created on{" "}
          {dayjs(originalInteraction.createdBy.timestamp).format("MMM D, YYYY")}{" "}
          by {originalInteraction.createdBy.fullName}
          {originalInteraction.lastUpdatedBy.timestamp !==
            originalInteraction.createdBy.timestamp &&
            `and was last updated on ${dayjs(
              originalInteraction.lastUpdatedBy.timestamp
            ).format("MMM D, YYYY")} by ${
              originalInteraction.lastUpdatedBy.fullName
            }`}
          .
        </div>
      );
    } else if (servicesResponse) {
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
    }
  }

  return null;
}
