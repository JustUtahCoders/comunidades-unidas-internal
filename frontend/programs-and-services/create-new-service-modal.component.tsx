import React from "react";
import { CUProgram, CUService } from "../add-client/services.component";
import Modal from "../util/modal.component";
import CUServiceInputs from "./cu-service-inputs.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";

export default function CreateNewServiceModal(
  props: CreateNewServiceModalProps
) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [service, setService] = React.useState(emptyService);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/services`, {
        signal: abortController.signal,
        method: "POST",
        body: {
          serviceName: service.serviceName,
          serviceDescription: service.serviceDescription,
          programId: Number(service.programId),
          isActive: service.isActive,
        },
      })
        .then(() => {
          setIsSaving(false);
          props.refetch();
          props.close();
          showGrowl({
            type: GrowlType.success,
            message: `Service '${service.serviceName}' was created.`,
          });
        })
        .catch((err) => {
          setIsSaving(false);
          setTimeout(() => {
            throw err;
          });
        });
    }
  }, [isSaving]);

  return (
    <Modal
      headerText="Create new Service"
      close={props.close}
      primaryText="Create service"
      primaryAction={() => formRef.current.requestSubmit()}
      secondaryText="Cancel"
      secondaryAction={props.close}
    >
      <CUServiceInputs
        formRef={formRef}
        handleSubmit={handleSubmit}
        programs={props.programs}
        service={service}
        setService={setService}
      />
    </Modal>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type CreateNewServiceModalProps = {
  programs: CUProgram[];
  close(): any;
  refetch(): any;
};

const emptyService: CUService = {
  programId: 1,
  id: null,
  programName: "",
  serviceDescription: "",
  serviceName: "",
  isActive: true,
};
