import React from "react";
import Modal from "../util/modal.component";
import { CUProgram } from "../add-client/services.component";
import easyFetch from "../util/easy-fetch";
import CUProgramInputs from "./cu-program-inputs.component";
import { cloneDeep } from "lodash-es";
import { maybe, useCss } from "kremling";

export default function EditableProgramRow(props: EditableProgramRowProps) {
  const [program, setProgram] = React.useState<CUProgram>(() =>
    cloneDeep(props.program)
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const formRef = React.useRef(null);
  const [showingModal, setShowingModal] = React.useState(false);
  const scope = useCss(css);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/programs/${program.id}`, {
        signal: abortController.signal,
        method: "PATCH",
        body: {
          programName: program.programName,
          programDescription: program.programDescription,
        },
      })
        .then(() => {
          props.refetch();
          setIsSaving(false);
          setShowingModal(false);
        })
        .catch(() => {
          setIsSaving(false);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving]);

  const trProps = props.canEdit ? { role: "button", tabIndex: 0 } : null;

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
          headerText="Modify Program"
          close={() => setShowingModal(false)}
          primaryText="Modify program"
          primaryAction={() => setIsSaving(true)}
          secondaryText="Cancel"
          secondaryAction={() => setShowingModal(false)}
        >
          <CUProgramInputs
            formRef={formRef}
            handleSubmit={handleSubmit}
            program={program}
            setProgram={setProgram}
          />
        </Modal>
      )}
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type EditableProgramRowProps = {
  refetch(): any;
  program: CUProgram;
  canEdit: boolean;
  children: React.ReactElement | React.ReactElement[];
};

const css = `
& .clickable {
  cursor: pointer;
}

& .clickable:hover {
  background-color: var(--medium-gray) !important;
}
`;
