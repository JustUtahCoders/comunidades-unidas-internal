import React from "react";
import Modal from "../../util/modal.component";
import EditInvoice, { FullInvoice } from "./edit-invoice.component";
import { SingleClient } from "../view-client.component";
import { CUService } from "../../add-client/services.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import ChangeInvoiceStatus from "./change-invoice-status.component";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import dayjs from "dayjs";
import { handlePromiseError } from "../../util/error-helpers";

export default function ViewInvoice(props: ViewInvoiceProps) {
  const { invoice, services, client } = props;
  const maxHeight = window.innerHeight - (2 * window.innerHeight) / 10 - 140;
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";
  const previewUrl = `/api/invoices/${props.invoice.id}/pdfs${tagsQuery}`;
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const editInvoiceRef = React.useRef();
  const invoiceStatusRef = React.useRef();
  const [extraClients, setExtraClients] = React.useState([]);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();

      const invoiceToSave = {
        // @ts-ignore
        ...editInvoiceRef.current.getInvoiceToSave(),
        // @ts-ignore
        status: invoiceStatusRef.current.status,
      };

      easyFetch(`/api/invoices/${invoice.id}${tagsQuery}`, {
        method: "PATCH",
        signal: ac.signal,
        body: invoiceToSave,
      }).then(
        () => {
          window.dispatchEvent(new CustomEvent("cu-chip:close-preview"));
          showGrowl({ type: GrowlType.success, message: "Invoice Saved!" });
          props.refetchInvoices();
          props.close();
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
  }, [isSaving, tagsQuery]);

  React.useEffect(() => {
    const ac = new AbortController();
    const clientIds = invoice.clients.filter(
      (item) => item !== props.client?.id
    );

    if (clientIds.length > 0) {
      easyFetch(`/api/clients-by-id?clientId=${clientIds.join("&clientId=")}`, {
        signal: ac.signal,
      })
        .then((data) => setExtraClients(data.clients))
        .catch(handlePromiseError);
      return () => {
        ac.abort();
      };
    }
  }, [props.client]);

  if (invoice.redacted) {
    return (
      <Modal
        headerText={`Invoice #${invoice.invoiceNumber}`}
        primaryText="Back"
        primaryAction={props.close}
        close={props.close}
      >
        <div>
          Invoice #{invoice.invoiceNumber} has been redacted. It was created by{" "}
          {invoice.createdBy.fullName} on{" "}
          {dayjs(invoice.createdBy.timestamp).format("MMMM DD, YYYY")} and last
          updated by {invoice.modifiedBy.fullName} on{" "}
          {dayjs(invoice.modifiedBy.timestamp).format("MMMM DD, YYYY")}.
        </div>
      </Modal>
    );
  }

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
          clients={[client, ...extraClients]}
          isEditing
          isDetached={props.isDetached}
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
  isDetached?: boolean;
};
