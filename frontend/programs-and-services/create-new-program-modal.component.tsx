import React from "react";
import Modal from "../util/modal.component";
import { CUProgram } from "../add-client/services.component";
import easyFetch from "../util/easy-fetch";
import CUProgramInputs from "./cu-program-inputs.component";

export default function CreateNewProgramModal(
  props: CreateNewProgramModalProps
) {
  const [program, setProgram] = React.useState<CUProgram>(emptyProgram);
  const [isSaving, setIsSaving] = React.useState(false);
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/programs`, {
        signal: abortController.signal,
        method: "POST",
        body: {
          programName: program.programName,
          programDescription: program.programDescription
        }
      })
        .then(() => {
          props.refetch();
          props.close();
        })
        .catch(() => {
          setIsSaving(false);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving]);

  return (
    <Modal
      headerText="Create Program"
      close={props.close}
      primaryText="Create program"
      primaryAction={() => setIsSaving(true)}
      secondaryText="Cancel"
      secondaryAction={props.close}
    >
      <CUProgramInputs
        formRef={formRef}
        handleSubmit={handleSubmit}
        program={program}
        setProgram={setProgram}
      />
    </Modal>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type CreateNewProgramModalProps = {
  close(): any;
  refetch(): any;
};

const emptyProgram: CUProgram = {
  id: null,
  isActive: true,
  programDescription: "",
  programName: ""
};
