import React from "react";
import Modal from "../util/modal.component";
import { cloneDeep, difference, differenceBy } from "lodash-es";
import {
  CUService,
  CUProgram,
  CUCustomQuestion,
} from "../add-client/services.component";
import { maybe, useCss } from "kremling";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import CUServiceInputs from "./cu-service-inputs.component";

export default function EditableServiceRow(
  props: EditableProgramServiceRowProps
) {
  const [showingModal, setShowingModal] = React.useState(false);
  const trProps = props.canEdit ? { role: "button", tabIndex: 0 } : null;
  const scope = useCss(css);
  const [modifiedService, setModifiedService] = React.useState<CUService>(
    cloneDeep(props.service)
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();

      const deletedQuestions = differenceBy(
        props.service.questions,
        modifiedService.questions,
        "id"
      );
      const addedQuestions = modifiedService.questions.filter((q) =>
        String(q.id).startsWith("new-")
      );
      const modifiedQuestions = differenceBy(
        modifiedService.questions,
        deletedQuestions,
        addedQuestions,
        "id"
      );

      Promise.all([
        easyFetch(`/api/services/${props.service.id}`, {
          method: "PATCH",
          signal: abortController.signal,
          body: {
            ...modifiedService,
            isActive: Boolean(modifiedService.isActive),
          },
        }),
        ...deletedQuestions.map((q) =>
          easyFetch(`/api/custom-service-questions/${q.id}`, {
            method: "DELETE",
          })
        ),
        ...addedQuestions.map((q) =>
          easyFetch(`/api/custom-service-questions`, {
            method: "POST",
            body: q,
          })
        ),
        ...modifiedQuestions.map((q) =>
          easyFetch(`/api/custom-service-questions/${q.id}`, {
            method: "PATCH",
            body: q,
          })
        ),
      ]).then(
        () => {
          showGrowl({
            message: "Service was updated",
            type: GrowlType.success,
          });
          props.refetch();
          setShowingModal(false);
          setIsSaving(false);
        },
        (err) => {
          setTimeout(() => {
            throw err;
          });
          setIsSaving(false);
        }
      );

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving]);

  return (
    <>
      <tr
        {...scope}
        {...trProps}
        onClick={() => setShowingModal(props.canEdit)}
        className={maybe("clickable", props.canEdit)}
      >
        {props.children}
      </tr>
      {showingModal && (
        <Modal
          close={close}
          primaryText="Save"
          primaryAction={() => formRef.current.requestSubmit()}
          secondaryText="Cancel"
          secondaryAction={close}
          headerText={`Modify ${props.service.serviceName}`}
          wide
        >
          <CUServiceInputs
            formRef={formRef}
            handleSubmit={handleSubmit}
            programs={props.programs}
            service={modifiedService}
            setService={setModifiedService}
          />
        </Modal>
      )}
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }

  function close() {
    setShowingModal(false);
  }
}

const css = `
& .clickable {
  cursor: pointer;
}

& .clickable:hover {
  background-color: var(--medium-gray) !important;
}
`;

type EditableProgramServiceRowProps = {
  canEdit: boolean;
  service: CUService;
  programs: CUProgram[];
  refetch(): any;
  children: React.ReactElement | React.ReactElement[];
};
