import React from "react";
import { FullPayment } from "./edit-payment.component";
import { FullInvoice } from "../invoices/edit-invoice.component";
import { SingleClient } from "../view-client.component";
import Chip from "../../util/chips/chip.component";
import { padStart } from "lodash-es";
import Modal from "../../util/modal.component";
import ViewPayment from "./view-payment.component";

function ClientPaymentsList(props: ClientPaymentsListProps) {
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
            <div style={{ fontSize: "1.8rem" }}>
              ${payment.paymentAmount.toFixed(2)}
            </div>
          }
          renderPreview={({ close }) => (
            <ViewPayment
              client={props.client}
              invoices={props.invoices}
              payment={payment}
              proceed={close}
              setPayment={null}
            />
          )}
        />
      ))}
    </>
  );
}

type ClientPaymentsListProps = {
  invoices: FullInvoice[];
  payments: FullPayment[];
  client: SingleClient;
  refetchPayments(): any;
};

export default ClientPaymentsList;