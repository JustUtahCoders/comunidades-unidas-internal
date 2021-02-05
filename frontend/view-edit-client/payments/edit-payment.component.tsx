import React from "react";
import { CUObjectAudit, FullInvoice } from "../invoices/edit-invoice.component";
import { SingleClient } from "../view-client.component";
import userIconUrl from "../../../icons/148705-essential-collection/svg/user.svg";
import dayjs from "dayjs";
import { useCss } from "kremling";
import css from "./edit-payment.css";
import { capitalize } from "lodash-es";
import { InvoiceStatus } from "../invoices/client-invoices.component";

const EditPayment = React.forwardRef(
  (props: EditPaymentProps, ref: React.RefObject<EditPaymentRef>) => {
    const [modifiedPayment, setModifiedPayment] = React.useState<FullPayment>(
      props.payment
    );

    React.useEffect(() => {
      if (!ref.current) {
        // @ts-ignore
        ref.current = {};
      }

      ref.current.getPaymentToSave = getPaymentToSave;
    });

    return (
      <div {...useCss(css)}>
        <div className="section-label">Payment Details</div>
        <div className="payment-details">
          <div className="input-block">
            <label htmlFor="client-name">Client(s)</label>
            {props.client && (
              <div className="client-row" id="client-name">
                {props.client.fullName}
                <img src={userIconUrl} alt="human profile shadow" />
              </div>
            )}
          </div>
          <div className="input-block">
            <label htmlFor="payment-date" style={{ display: "block" }}>
              Payment Date
            </label>
            <input
              required
              type="date"
              id="payment-date"
              autoComplete="new-password"
              value={dayjs(modifiedPayment.paymentDate).format("YYYY-MM-DD")}
              onChange={(evt) =>
                setModifiedPayment({
                  ...modifiedPayment,
                  paymentDate: evt.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="invoices">
          <label htmlFor="invoices-list" className="section-label">
            Apply to Invoices
          </label>
          <div className="input-block">
            {props.invoices
              .filter(
                (i) =>
                  i.status !== InvoiceStatus.closed &&
                  i.status !== InvoiceStatus.completed
              )
              .map((invoice) => (
                <label key={invoice.id} className="invoice-row">
                  <input
                    type="checkbox"
                    name="payment-invoices"
                    id="invoices-list"
                  />
                  Invoice #{invoice.invoiceNumber} ({capitalize(invoice.status)}{" "}
                  - ${invoice.totalCharged.toFixed(2)})
                </label>
              ))}
          </div>
        </div>
      </div>
    );

    function getPaymentToSave() {
      return props.payment;
    }
  }
);

export default EditPayment;

type EditPaymentProps = {
  payment: FullPayment;
  client: SingleClient;
  isNew: boolean;
  invoices: FullInvoice[];
};

export type InvoiceSummary = {
  invoiceId: number;
  amount: number;
};

export enum PaymentType {
  cash = "cash",
  credit = "credit",
  debit = "debit",
  check = "check",
  other = "other",
}

export function humanReadablePaymentType(paymentType: PaymentType): string {
  switch (paymentType) {
    case PaymentType.credit:
      return "Credit Card";
    case PaymentType.check:
      return "Check";
    case PaymentType.cash:
      return "Cash";
    case PaymentType.debit:
      return "Debit Card";
    case PaymentType.other:
      return "Other";
    default:
      return capitalize(paymentType);
  }
}

export type FullPayment = {
  id: number;
  paymentDate: string;
  invoices: InvoiceSummary[];
  paymentAmount: number;
  paymentType: PaymentType;
  payerName: null | string;
  payerClientIds: number[];
  redacted: boolean;
  createdBy?: CUObjectAudit;
  modifiedBy?: CUObjectAudit;
  donationId?: number;
  donationAmount?: number;
};

export type EditPaymentRef = {
  getPaymentToSave(): FullPayment;
};
