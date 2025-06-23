import React from "react";
import { GrowlType, showGrowl } from "../../growls/growls.component";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import PartnerServiceInputs from "./partner-service-inputs.component";
import { NewPartnerService, Partner } from "./partners.component";

export default function CreateNewPartnerService(
  props: CreateNewPartnerServiceProps
) {
  const formRef = React.useRef<HTMLFormElement>();
  const [isSaving, setIsSaving] = React.useState(false);
  const [partnerId, setPartnerId] = React.useState<number>(null);
  const [partnerService, setPartnerService] =
    React.useState(emptyPartnerService);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();
      easyFetch(`/api/partners/${partnerId}/services`, {
        signal: ac.signal,
        method: "POST",
        body: partnerService,
      })
        .then(() => {
          props.refetch();
          props.close();
          showGrowl({
            type: GrowlType.success,
            message: `Partner service ${partnerService.name} was created.`,
          });
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [isSaving, partnerService]);

  return (
    <Modal
      headerText="Create New Partner Service"
      close={props.close}
      primaryText="Create partner service"
      primaryAction={() => formRef.current.requestSubmit()}
      secondaryText="Cancel"
      secondaryAction={props.close}
      wide
    >
      <PartnerServiceInputs
        formRef={formRef}
        handleSubmit={handleSubmit}
        partnerService={partnerService}
        setPartnerService={setPartnerService}
        partners={props.partners}
        partnerId={partnerId}
        setPartnerId={setPartnerId}
        showSelectPartner
      />
    </Modal>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

const emptyPartnerService: NewPartnerService = {
  name: "",
  isActive: true,
};

type CreateNewPartnerServiceProps = {
  close(): any;
  refetch(): any;
  partners: Partner[];
};
