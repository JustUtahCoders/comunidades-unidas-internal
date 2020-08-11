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
    return <div>No unpaid invoices</div>;
  }
}

CreatePaymentCheckInvoices.backButtonText = "Cancel";

export default CreatePaymentCheckInvoices;
