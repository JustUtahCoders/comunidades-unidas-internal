import React from "react";
import { InvoiceSummary, InvoiceStatus } from "./client-invoices.component";
import Chip from "../../util/chips/chip.component";
import { capitalize } from "../../reports/shared/report.helpers";
import Modal from "../../util/modal.component";
import { SingleClient } from "../view-client.component";
import EditInvoice, { FullInvoice } from "./edit-invoice.component";
import { CUServicesList, CUService } from "../../add-client/services.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import ChangeInvoiceStatus, {
  statusColor,
} from "./change-invoice-status.component";

export default function ClientInvoiceList(props: ClientInvoiceListProps) {
  const editInvoiceRef = React.useRef();
  const invoiceStatusRef = React.useRef();
  const [invoiceToSave, setInvoiceToSave] = React.useState<FullInvoice>(null);
  // @ts-ignore
  const editingId = editInvoiceRef.current
    ? // @ts-ignore
      editInvoiceRef.current.getInvoiceId()
    : null;

  React.useEffect(() => {
    if (invoiceToSave) {
      const ac = new AbortController();

      easyFetch(`/api/invoices/${editingId}`, {
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
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => {
        ac.abort();
      };
    }
  }, [invoiceToSave, editingId]);

  return (
    <>
      {props.invoices.map((invoice) => (
        <Chip
          key={invoice.id}
          topContent={status(invoice)}
          bottomContent={amount(invoice)}
          bottomStyles={{ fontSize: "1.8rem" }}
          renderPreview={({ close }) => (
            <Modal
              close={close}
              primaryText="Save"
              primaryAction={handleSubmit}
              primarySubmit
              secondaryText="Cancel"
              secondaryAction={close}
              headerText="Create invoice"
              wide
              customHeaderContent={
                <ChangeInvoiceStatus
                  ref={invoiceStatusRef}
                  invoiceStatus={invoice.status}
                />
              }
            >
              <EditInvoice
                invoice={invoice as FullInvoice}
                client={props.client}
                services={props.services}
                ref={editInvoiceRef}
              />
            </Modal>
          )}
        />
      ))}
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    if (evt.target.checkValidity()) {
      setInvoiceToSave({
        // @ts-ignore
        ...editInvoiceRef.current.getInvoiceToSave(),
        // @ts-ignore
        status: invoiceStatusRef.current.status,
      });
    }
  }
}

function amount(invoice: InvoiceSummary) {
  return <>${invoice.totalCharged.toFixed(2)}</>;
}

function status(invoice: InvoiceSummary) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: "bold" }}>#{invoice.invoiceNumber}</div>
      <div style={{ color: statusColor(invoice.status) }}>
        {capitalize(invoice.status)}
      </div>
    </div>
  );
}

type ClientInvoiceListProps = {
  invoices: InvoiceSummary[];
  client: SingleClient;
  services: CUService[];
  refetchInvoices(): any;
};
