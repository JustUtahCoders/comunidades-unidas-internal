import React from "react";
import { ClientLog } from "./client-history.component";
import { startCase } from "lodash-es";
import Modal from "../../util/modal.component";
import EditCaseNote from "../case-notes/edit-case-note.component";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import EditClientInteraction from "../interactions/edit-client-interaction.component";
import EditFollowUpInteraction from "../interactions/edit-follow-up-interaction.component";

const editLogComponents = {
  caseNote: EditCaseNote,
  ["clientInteraction:created"]: EditClientInteraction,
  ["clientInteraction:updated"]: EditClientInteraction,
  ["clientInteraction:serviceProvided"]: EditClientInteraction,
  "follow-up": EditFollowUpInteraction,
};

export default function EditLog({
  log,
  close,
  clientId,
  clientFullName,
}: EditLogProps) {
  const actionsRef = React.useRef<EditLogActions>({
    save: () => Promise.resolve(),
    delete: () => Promise.resolve(),
  });
  const [status, setStatus] = React.useState<EditLogState>(
    EditLogState.editing
  );
  const [editable, setEditable] = React.useState(true);

  const Edit = editLogComponents[log.logType];

  React.useEffect(() => {
    if (status === EditLogState.saving) {
      const abortController = new AbortController();

      actionsRef.current
        .save(abortController)
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: `${getInteractionType()} was updated`,
          });
          close(true);
        })
        .catch((err) => {
          close(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    } else if (status === EditLogState.deleting) {
      const abortController = new AbortController();

      actionsRef.current
        .delete(abortController)
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: `${getInteractionType()} was deleted`,
          });
          close(true);
        })
        .catch((err) => {
          close(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [status]);

  if (!Edit) {
    throw Error(`Editing logType '${log.logType}' is not yet implemented`);
  }

  return (
    <Modal
      headerText={`${
        editable ? "Edit " : ""
      }${getInteractionType()} for ${clientFullName}`}
      primaryAction={editable ? saveLog : close}
      primaryText={editable ? "Save" : "Done"}
      secondaryAction={editable ? deleteLog : null}
      secondaryText={editable ? "Delete" : null}
      close={close}
      wide={Edit.wideModal}
    >
      <Edit
        log={log}
        actionsRef={actionsRef}
        clientId={clientId}
        notEditable={() => setEditable(false)}
      />
    </Modal>
  );

  function saveLog() {
    setStatus(EditLogState.saving);
  }

  function deleteLog() {
    setStatus(EditLogState.deleting);
  }

  function getInteractionType() {
    return startCase(
      log.logType
        .replace(":created", "")
        .replace(":updated", "")
        .replace(":deleted", "")
    );
  }
}

type EditLogProps = {
  log: ClientLog;
  close(wasDeleted?: boolean): any;
  clientId: string;
  clientFullName: string;
};

enum EditLogState {
  editing = "editing",
  saving = "saving",
  deleting = "deleting",
}

export type LogTypeEditProps = {
  log: ClientLog;
  actionsRef: React.MutableRefObject<EditLogActions>;
  clientId: string;
  notEditable: () => void;
};

type EditLogActions = {
  save(abortController: AbortController): Promise<any>;
  delete(abortController: AbortController): Promise<any>;
};
