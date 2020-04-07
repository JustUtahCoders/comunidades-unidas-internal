import React from "react";
import Modal from "../../util/modal.component";
import { SelectedClients } from "../client-list.component";
import easyFetch from "../../util/easy-fetch";

export default function DeleteBulkClientModal(
  props: DeleteBulkClientModalProps
) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isDeleting) {
      const abortController = new AbortController();

      Promise.all(
        Object.values(props.selectedClients).map((c) =>
          easyFetch(`/api/clients/${c.id}`, {
            method: "DELETE",
            signal: abortController.signal,
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
      headerText="Delete Clients"
      primaryText="No"
      primaryAction={props.close}
      secondaryText="Yes"
      secondaryAction={() => setIsDeleting(true)}
    >
      <p>
        Are you sure you want to delete the following selected client
        {Object.keys(props.selectedClients).length > 0 ? "s" : ""}
      </p>
      <ul>
        {Object.values(props.selectedClients).map((client) => (
          <li key={client.id}>
            #{client.id} - {client.fullName}
          </li>
        ))}
      </ul>
    </Modal>
  );
}

type DeleteBulkClientModalProps = {
  close: (shouldRefetch?: boolean) => any;
  selectedClients: SelectedClients;
};
