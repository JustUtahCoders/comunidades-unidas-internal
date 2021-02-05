import React from "react";
import { FullPayment } from "./edit-payment.component";
import { FullInvoice } from "../invoices/edit-invoice.component";
import { SingleClient } from "../view-client.component";
import Chip from "../../util/chips/chip.component";
import { padStart } from "lodash-es";
import ViewPayment from "./view-payment.component";

function PaymentsList(props: ClientPaymentsListProps) {
  return (
    <>
      {props.payments.map((payment) => (
        <Chip
          key={payment.id}
          topContent={
            <>
              <div>Payment</div>
              <div>#{padStart(String(payment.id), 4, "0")}</div>
            </>
          }
          bottomContent={
            <div style={{ fontSize: "1.8rem" }}>{paymentAmount(payment)}</div>
          }
          renderPreview={({ close }) => (
            <ViewPayment
              client={props.client}
              invoices={props.invoices}
              payment={payment}
              proceed={close}
              setPayment={null}
              refetchPayments={props.refetchPayments}
              isDetached={props.isDetached}
            />
          )}
        />
      ))}
    </>
  );

  function paymentAmount(payment: FullPayment) {
    if (payment.redacted) {
      return "(Redacted)";
    } else {
      return `$${payment.paymentAmount.toFixed(2)}`;
    }
  }
}

type ClientPaymentsListProps = {
  invoices: FullInvoice[];
  payments: FullPayment[];
  client: SingleClient;
  refetchPayments(): any;
  isDetached?: boolean;
};

export default PaymentsList;
