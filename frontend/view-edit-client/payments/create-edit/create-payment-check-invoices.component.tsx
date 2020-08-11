import React from "react";
import { CreatePaymentStepProps } from "../create-payment.component";
import { InvoiceStatus } from "../../invoices/client-invoices.component";

function CreatePaymentCheckInvoices(props: CreatePaymentStepProps) {
  const unpaidInvoices = props.invoices.filter(
    (i) => i.status === InvoiceStatus.draft || i.status === InvoiceStatus.open
  );

  React.useEffect(() => {
    if (unpaidInvoices.length > 0) {
      props.proceed();
    }
  });

  if (unpaidInvoices.length > 0) {
    return null;
  } else {
    return (
      <>
        <h4 style={{ marginTop: 0 }}>
          There are no unpaid invoices for this client.
        </h4>
        <div>
          It is recommended to create an invoice before creating a payment.
          However, you may create the payment anyway if you'd like to.
        </div>
      </>
    );
  }
}

CreatePaymentCheckInvoices.backButtonText = "Cancel";
CreatePaymentCheckInvoices.nextButtonText = "Proceed anyway";

export default CreatePaymentCheckInvoices;
