import React from "react";
import Modal from "../../util/modal.component";
import { SelectedLeads } from "../lead-list.component";
import easyFetch from "../../util/easy-fetch";

export default function DeleteBulkLeadModal(props: DeleteBulkLeadModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isDeleting) {
      const abortController = new AbortController();

      Promise.all(
        Object.values(props.selectedLeads).map(c =>
          easyFetch(`/api/leads/${c.id}`, {
            method: "DELETE",
            signal: abortController.signal
          })
        )
      ).then(() => {
        setIsDeleting(false);
        props.close(true);
      });

      return () => {
        abortController.abort();
      };
    }
  }, [isDeleting, props.close]);

  return (
    <Modal
      close={props.close}
      headerText="Delete Leads"
      primaryText="No"
      primaryAction={props.close}
      secondaryText="Yes"
      secondaryAction={() => setIsDeleting(true)}
    >
      <p>
        Are you sure you want to delete the following selected lead
        {Object.keys(props.selectedLeads).length > 0 ? "s" : ""}
      </p>
      <ul>
        {Object.values(props.selectedLeads).map(lead => (
          <li key={lead.id}>
            #{lead.id} - {lead.fullName}
          </li>
        ))}
      </ul>
    </Modal>
  );
}

type DeleteBulkLeadModalProps = {
  close: (shouldRefetch?: boolean) => any;
  selectedLeads: SelectedLeads;
};
