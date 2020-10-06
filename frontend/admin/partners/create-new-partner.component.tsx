import React from "react";
import { GrowlType, showGrowl } from "../../growls/growls.component";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import PartnerInputs from "./partner-inputs.component";
import { NewPartner } from "./partners.component";

export default function CreateNewPartner(props: CreateNewPartnerProps) {
  const formRef = React.useRef<HTMLFormElement>();
  const [isSaving, setIsSaving] = React.useState(false);
  const [partner, setPartner] = React.useState(emptyPartner);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();
      easyFetch(`/api/partners`, {
        signal: ac.signal,
        method: "POST",
        body: partner,
      })
        .then(() => {
          props.refetch();
          props.close();
          showGrowl({
            type: GrowlType.success,
            message: `Partner ${partner.name} was created.`,
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
  }, [isSaving, partner]);

  return (
    <Modal
      headerText="Create New Partner"
      close={props.close}
      primaryText="Create partner"
      primaryAction={() => formRef.current.requestSubmit()}
      secondaryText="Cancel"
      secondaryAction={props.close}
      wide
    >
      <PartnerInputs
        formRef={formRef}
        handleSubmit={handleSubmit}
        partner={partner}
        setPartner={setPartner}
      />
    </Modal>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

const emptyPartner: NewPartner = {
  name: "",
  isActive: true,
};

type CreateNewPartnerProps = {
  close(): any;
  refetch(): any;
};
