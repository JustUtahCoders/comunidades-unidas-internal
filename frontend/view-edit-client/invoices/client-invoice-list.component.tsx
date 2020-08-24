import React from "react";
import Chip from "../../util/chips/chip.component";
import { capitalize } from "../../reports/shared/report.helpers";
import { SingleClient } from "../view-client.component";
import { FullInvoice } from "./edit-invoice.component";
import { CUService } from "../../add-client/services.component";
import { statusColor } from "./change-invoice-status.component";
import ViewInvoice from "./view-invoice.component";
import { InvoiceStatus } from "./client-invoices.component";

export default function ClientInvoiceList(props: ClientInvoiceListProps) {
  return (
    <>
      {props.invoices.map((invoice) => (
        <Chip
          key={invoice.id}
          topContent={status(invoice)}
          bottomContent={amount(invoice)}
          bottomStyles={{ fontSize: "1.8rem" }}
          renderPreview={({ close }) => (
            <ViewInvoice
              invoice={invoice}
              services={props.services}
              client={props.client}
              close={close}
              refetchInvoices={props.refetchInvoices}
            />
          )}
        />
      ))}
    </>
  );
}

function amount(invoice: FullInvoice) {
  if (invoice.status === InvoiceStatus.draft) {
    return <>$0.00</>;
  } else if (invoice.redacted) {
    return <>(Redacted)</>;
  } else {
    return <>${invoice.totalCharged.toFixed(2)}</>;
  }
}

function status(invoice: FullInvoice) {
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
  invoices: FullInvoice[];
  client: SingleClient;
  services: CUService[];
  refetchInvoices(): any;
};
