import React from "react";
import Modal from "../../util/modal.component";
import EditInvoice from "./edit-invoice.component";
import easyFetch from "../../util/easy-fetch";
import { SingleClient } from "../view-client.component";
import { CUService } from "../../add-client/services.component";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import { noop } from "lodash-es";
import ChangeInvoiceStatus from "./change-invoice-status.component";

export default function CreateInvoice(props: CreateInvoiceProps) {
  const [invoice, setInvoice] = React.useState(null);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>(
    SaveStatus.saved
  );
  const editInvoiceRef = React.useRef();
  const invoiceStatusRef = React.useRef();

  React.useEffect(() => {
    const ac = new AbortController();

    easyFetch(`/api/invoices`, { method: "POST", signal: ac.signal }).then(
      setInvoice,
      (err) => {
        setTimeout(() => {
          throw err;
        });
      }
    );

    return () => {
      ac.abort();
    };
  }, []);

  React.useEffect(() => {
    if (saveStatus === SaveStatus.shouldSave) {
      setSaveStatus(SaveStatus.saving);

      const ac = new AbortController();
      easyFetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        body: {
          // @ts-ignore
          ...editInvoiceRef.current.getInvoiceToSave(),
          // @ts-ignore
          id: invoiceStatusRef.current.status,
        },
      })
        .then(() => {
          showGrowl({ type: GrowlType.success, message: "Invoice created!" });
          props.close();
        })
        .catch((err) => {
          setSaveStatus(SaveStatus.error);
          setTimeout(() => {
            throw err;
          });
        });

      return () => ac.abort();
    }
  }, [saveStatus]);

  return (
    invoice && (
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
          client={props.client}
          services={props.services}
          ref={editInvoiceRef}
        />
      </Modal>
    )
  );

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
};

enum SaveStatus {
  shouldSave = "shouldSave",
  saving = "saving",
  saved = "saved",
  error = "error",
}
