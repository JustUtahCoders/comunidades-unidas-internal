import { maybe } from "kremling";
import { cloneDeep } from "lodash-es";
import React from "react";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import PartnerInputs from "./partner-inputs.component";
import { Partner } from "./partners.component";

export default function EditablePartnerRow(props: EditablePartnerRowProps) {
  const [partner, setPartner] = React.useState(() => cloneDeep(props.partner));
  const [showingModal, setShowingModal] = React.useState(false);
  const trProps = props.canEdit ? { role: "button", tabIndex: 0 } : null;
  const [isSaving, setIsSaving] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>();

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();
      easyFetch(`/api/partners/${partner.id}`, {
        signal: ac.signal,
        method: "PATCH",
        body: {
          name: partner.name,
          isActive: partner.isActive,
        },
      })
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
  }, [isSaving, partner]);

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
          headerText="Modify Partner"
          close={closeModal}
          primaryText="Modify Partner"
          primaryAction={() => setIsSaving(true)}
          secondaryText="Cancel"
          secondaryAction={closeModal}
        >
          <PartnerInputs
            partner={partner}
            setPartner={(newPartner) =>
              setPartner({ ...partner, ...newPartner })
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

type EditablePartnerRowProps = {
  partner: Partner;
  canEdit: boolean;
  children: React.ReactElement | React.ReactElement[];
  refetch(): any;
};
