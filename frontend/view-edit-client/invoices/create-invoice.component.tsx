import React from "react";
import Modal from "../../util/modal.component";
import EditInvoice from "./edit-invoice.component";
import easyFetch from "../../util/easy-fetch";
import { SingleClient } from "../view-client.component";
import { CUService } from "../../add-client/services.component";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import ChangeInvoiceStatus from "./change-invoice-status.component";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import ViewInvoice from "./view-invoice.component";

export default function CreateInvoice(props: CreateInvoiceProps) {
  const [invoice, setInvoice] = React.useState(null);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>(
    SaveStatus.unsaved
  );
  const editInvoiceRef = React.useRef();
  const invoiceStatusRef = React.useRef();
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";

  React.useEffect(() => {
    const ac = new AbortController();

    easyFetch(`/api/invoices${tagsQuery}`, {
      method: "POST",
      signal: ac.signal,
    }).then(setInvoice, (err) => {
      setTimeout(() => {
        throw err;
      });
    });

    return () => {
      ac.abort();
    };
  }, [tagsQuery]);

  React.useEffect(() => {
    if (saveStatus === SaveStatus.shouldSave) {
      setSaveStatus(SaveStatus.saving);

      const ac = new AbortController();
      easyFetch(`/api/invoices/${invoice.id}${tagsQuery}`, {
        method: "PATCH",
        body: {
          // @ts-ignore
          ...editInvoiceRef.current.getInvoiceToSave(),
          // @ts-ignore
          id: invoiceStatusRef.current.status,
        },
      })
        .then((invoice) => {
          setSaveStatus(SaveStatus.saved);
          setInvoice(invoice);
          showGrowl({ type: GrowlType.success, message: "Invoice created!" });
          props.refetchInvoices();
        })
        .catch((err) => {
          setSaveStatus(SaveStatus.error);
          setTimeout(() => {
            throw err;
          });
        });

      return () => ac.abort();
    }
  }, [saveStatus, tagsQuery]);

  if (saveStatus === SaveStatus.saved) {
    return (
      <ViewInvoice
        close={props.close}
        refetchInvoices={props.refetchInvoices}
        invoice={invoice}
        services={props.services}
        client={props.client}
      />
    );
  } else if (invoice) {
    return (
      <Modal
        customHeaderContent={
          <ChangeInvoiceStatus
            ref={invoiceStatusRef}
            invoiceStatus={invoice.status}
          />
        }
        close={cancel}
        primaryText="Save"
        primaryAction={handleSubmit}
        primarySubmit
        secondaryText="Cancel"
        secondaryAction={cancel}
        headerText="Create invoice"
        wide
      >
        <EditInvoice
          invoice={invoice}
          clients={[props.client]}
          services={props.services}
          ref={editInvoiceRef}
          isEditing={false}
          isDetached={props.isDetached}
        />
      </Modal>
    );
  } else {
    return null;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (evt.target.checkValidity()) {
      setSaveStatus(SaveStatus.shouldSave);
    }
  }

  function cancel() {
    props.close();
  }
}

type CreateInvoiceProps = {
  close(): any;
  client: SingleClient;
  services: CUService[];
  refetchInvoices(): any;
  isDetached?: boolean;
};

enum SaveStatus {
  unsaved = "unsaved",
  shouldSave = "shouldSave",
  saving = "saving",
  saved = "saved",
  error = "error",
}
