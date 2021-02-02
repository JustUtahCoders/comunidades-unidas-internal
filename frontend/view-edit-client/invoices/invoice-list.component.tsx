import React from "react";
import Chip from "../../util/chips/chip.component";
import { capitalize } from "../../reports/shared/report.helpers";
import { SingleClient } from "../view-client.component";
import { FullInvoice } from "./edit-invoice.component";
import { CUService } from "../../add-client/services.component";
import { statusColor } from "./change-invoice-status.component";
import ViewInvoice from "./view-invoice.component";
import { InvoiceStatus } from "./client-invoices.component";
import queryString from "query-string";

export default function InvoiceList(props: InvoiceListProps) {
  const query = queryString.parse(window.location.search);
  const [
    initialInvoicePreview,
    setInitialInvoicePreview,
  ] = React.useState<String>(query.invoice as string);

  return (
    <>
      {props.invoices.map((invoice) => {
        const startPreviewing = String(invoice.id) === initialInvoicePreview;
        return (
          <Chip
            key={invoice.id}
            topContent={status(invoice)}
            bottomContent={amount(invoice)}
            bottomStyles={{ fontSize: "1.8rem" }}
            startPreviewing={startPreviewing}
            renderPreview={({ close }) => (
              <ViewInvoice
                invoice={invoice}
                services={props.services}
                client={props.client}
                close={() => {
                  setInitialInvoicePreview(null);
                  close();
                }}
                refetchInvoices={props.refetchInvoices}
                isDetached={props.isDetached}
              />
            )}
          />
        );
      })}
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

type InvoiceListProps = {
  invoices: FullInvoice[];
  client: SingleClient;
  services: CUService[];
  refetchInvoices(): any;
  isDetached?: boolean;
};
