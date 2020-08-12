import React from "react";
import { InvoiceStatus } from "./client-invoices.component";
import { capitalize } from "lodash-es";
import css from "./change-invoice-status.css";
import { useCss } from "kremling";

const ChangeInvoiceStatus = React.forwardRef(function ChangeInvoiceStatus(
  props: ChangeInvoiceStatusProps,
  ref
) {
  const [modifiedStatus, setModifiedStatus] = React.useState<InvoiceStatus>(
    props.invoiceStatus
  );

  React.useEffect(() => {
    // @ts-ignore
    ref.current = {
      status: modifiedStatus,
    };
  });

  const color = statusColor(modifiedStatus);

  return (
    <div {...useCss(css)} className="invoice-status">
      <div className="status-circle" style={{ backgroundColor: color }} />
      <select onChange={handleChange} value={modifiedStatus}>
        {Object.keys(InvoiceStatus).map((status) => (
          <option key={status} value={status}>
            {capitalize(status)}
          </option>
        ))}
      </select>
    </div>
  );

  function handleChange(evt) {
    setModifiedStatus(evt.target.value);
  }
});

export function statusColor(status: InvoiceStatus) {
  switch (status) {
    case InvoiceStatus.draft:
      return "var(--very-dark-gray)";
    case InvoiceStatus.open:
      return "var(--medium-blue)";
    case InvoiceStatus.completed:
      return "green";
    case InvoiceStatus.closed:
      return "var(--medium-red)";
  }
}

export default ChangeInvoiceStatus;

type ChangeInvoiceStatusProps = {
  invoiceStatus: InvoiceStatus;
};
