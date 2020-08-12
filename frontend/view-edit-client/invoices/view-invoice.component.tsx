import React from "react";
import Modal from "../../util/modal.component";
import EditInvoice, { FullInvoice } from "./edit-invoice.component";
import { SingleClient } from "../view-client.component";
import { CUService } from "../../add-client/services.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import ChangeInvoiceStatus from "./change-invoice-status.component";

export default function ViewInvoice(props: ViewInvoiceProps) {
  const { invoice, services, client } = props;
  const maxHeight = window.innerHeight - (2 * window.innerHeight) / 10 - 140;
  const previewUrl = `/api/invoices/${props.invoice.id}/pdfs`;
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const editInvoiceRef = React.useRef();
  const invoiceStatusRef = React.useRef();

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();

      const invoiceToSave = {
        // @ts-ignore
        ...editInvoiceRef.current.getInvoiceToSave(),
        // @ts-ignore
        status: invoiceStatusRef.current.status,
      };

      easyFetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        signal: ac.signal,
        body: invoiceToSave,
      }).then(
        () => {
          window.dispatchEvent(new CustomEvent("cu-chip:close-preview"));
          showGrowl({ type: GrowlType.success, message: "Invoice Saved!" });
          props.refetchInvoices();
        },
        (err) => {
          setIsSaving(false);
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => {
        ac.abort();
      };
    }
  }, [isSaving]);

  return (
    <Modal
      customHeaderContent={
        isEditing && (
          <ChangeInvoiceStatus
            ref={invoiceStatusRef}
            invoiceStatus={invoice.status}
          />
        )
      }
      headerText={`Invoice #${invoice.invoiceNumber}`}
      primaryText={isEditing ? "Save" : "Download"}
      primaryAction={isEditing ? saveInvoice : downloadInvoice}
      secondaryText={isEditing ? "Back" : "Print"}
      secondaryAction={isEditing ? cancelEdit : printInvoice}
      tertiaryText="Edit"
      tertiaryAction={editPayment}
      close={props.close}
      wide
    >
      {isEditing ? (
        <EditInvoice
          ref={editInvoiceRef}
          invoice={invoice}
          services={services}
          client={client}
          isEditing
        />
      ) : (
        <object
          data={previewUrl}
          type="application/pdf"
          width="100%"
          height={maxHeight + "px"}
        >
          <embed
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height={maxHeight + "px"}
          />
        </object>
      )}
    </Modal>
  );

  function printInvoice() {
    window.open(previewUrl, "_blank");
  }

  function downloadInvoice() {
    window.open(`${previewUrl}?download=true`, "_blank");
  }

  function editPayment() {
    setIsEditing(true);
  }

  function saveInvoice() {
    setIsSaving(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }
}

type ViewInvoiceProps = {
  invoice: FullInvoice;
  client?: SingleClient;
  services: CUService[];
  close(): any;
  refetchInvoices(): any;
};
