import { maybe } from "kremling";
import { cloneDeep } from "lodash-es";
import React from "react";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import PartnerServiceInputs from "./partner-service-inputs.component";
import { PartnerService } from "./partners.component";

export default function EditablePartnerServiceRow(
  props: EditablePartnerServiceRowProps
) {
  const [partnerService, setPartnerService] = React.useState(() =>
    cloneDeep(props.partnerService)
  );
  const [showingModal, setShowingModal] = React.useState(false);
  const trProps = props.canEdit ? { role: "button", tabIndex: 0 } : null;
  const [isSaving, setIsSaving] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>();

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();
      easyFetch(
        `/api/partners/${props.partnerId}/services/${partnerService.id}`,
        {
          signal: ac.signal,
          method: "PATCH",
          body: {
            name: partnerService.name,
            isActive: partnerService.isActive,
          },
        }
      )
        .then(() => {
          props.refetch();
          setShowingModal(false);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setIsSaving(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [isSaving, partnerService, props.partnerId]);

  return (
    <>
      <tr
        {...trProps}
        onClick={() => setShowingModal(props.canEdit)}
        className={maybe("clickable", props.canEdit)}
      >
        {props.children}
      </tr>
      {showingModal && (
        <Modal
          headerText="Modify Partner Service"
          close={closeModal}
          primaryText="Modify Partner Service"
          primaryAction={() => setIsSaving(true)}
          secondaryText="Cancel"
          secondaryAction={closeModal}
        >
          <PartnerServiceInputs
            partnerService={partnerService}
            setPartnerService={(newPartnerService) =>
              setPartnerService({ ...partnerService, ...newPartnerService })
            }
            formRef={formRef}
            handleSubmit={handleSubmit}
          />
        </Modal>
      )}
    </>
  );

  function closeModal() {
    setShowingModal(false);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type EditablePartnerServiceRowProps = {
  partnerId: number;
  partnerService: PartnerService;
  canEdit: boolean;
  children: React.ReactElement | React.ReactElement[];
  refetch(): any;
};
