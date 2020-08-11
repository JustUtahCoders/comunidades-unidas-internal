import React from "react";
import css from "./create-payment-select-invoices.css";
import { CreatePaymentStepProps } from "../create-payment.component";
import { useCss } from "kremling";
import { InvoiceSummary } from "../edit-payment.component";
import { InvoiceStatus } from "../../invoices/client-invoices.component";
import { sumBy, intersectionBy, isEmpty } from "lodash-es";

export default function CreatePaymentSelectInvoices(
  props: CreatePaymentStepProps
) {
  const unpaidInvoices = props.invoices.filter(
    (i) => i.status === InvoiceStatus.open || i.status === InvoiceStatus.draft
  );
  const [donationAmount, setDonationAmount] = React.useState("");
  const [otherAmount, setOtherAmount] = React.useState("");

  // @ts-ignore
  const pendingInvoicePayments = intersectionBy(
    props.payment.invoices,
    props.invoices,
    // @ts-ignore
    (i) => i.invoiceId || i.id
  );

  React.useEffect(() => {
    const paymentAmount = totalPaymentAmount();
    if (paymentAmount !== props.payment.paymentAmount) {
      props.setPayment({
        ...props.payment,
        paymentAmount,
      });
    }
  });

  return (
    <div {...useCss(css)} className="container">
      <p>Which invoices should this payment be applied to?</p>
      <div className="invoices">
        <table>
          <caption>Outstanding Invoices</caption>
          <thead>
            <tr>
              <th style={{ width: "4rem" }}>
                <input
                  type="checkbox"
                  checked={
                    pendingInvoicePayments.length === unpaidInvoices.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Invoice #</th>
              <th>Total</th>
              <th>Balance</th>
              <th style={{ width: "15rem" }}>Amount to be Paid</th>
            </tr>
          </thead>
          <tbody>
            {unpaidInvoices.map((invoice) => {
              const invoicePayment = props.payment.invoices.find(
                (i) => i.invoiceId === invoice.id
              );

              return (
                <tr key={invoice.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(invoicePayment)}
                      onChange={(evt) => toggleCheckInvoice(evt, invoice)}
                    />
                  </td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>${invoice.totalCharged.toFixed(2)}</td>
                  <td>
                    $
                    {sumBy(invoice.payments, "amountTowardsInvoice").toFixed(2)}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="$0.00"
                      value={invoicePayment ? invoicePayment.amount : ""}
                      onChange={(evt) => updatePaymentAmount(evt, invoice)}
                      onBlur={() => handleBlur(invoice, invoicePayment)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "3.2rem" }}>Any donations or other payments?</p>
      <div className="other-payments">
        <div>
          <label htmlFor="donation-amount">Donation:</label>
          <input
            type="number"
            step="0.01"
            placeholder="$0.00"
            id="donation-amount"
            value={donationAmount}
            onChange={updateDonationAmount}
          />
        </div>
        <div>
          <label htmlFor="other-amount">Other:</label>
          <input
            type="number"
            step="0.01"
            placeholder="$0.00"
            id="other-amount"
            value={otherAmount}
            onChange={updateOtherAmount}
          />
        </div>
      </div>
    </div>
  );

  function toggleCheckInvoice(evt, invoice) {
    let newPaymentInvoices;
    if (evt.target.checked) {
      newPaymentInvoices = props.payment.invoices.concat({
        invoiceId: invoice.id,
        amount: invoice.totalCharged.toFixed(2),
      });
    } else {
      newPaymentInvoices = props.payment.invoices.filter(
        (i) => i.invoiceId !== invoice.id
      );
    }

    props.setPayment({
      ...props.payment,
      invoices: newPaymentInvoices,
      paymentAmount: totalPaymentAmount(newPaymentInvoices),
    });
  }

  function toggleSelectAll(evt) {
    let newPaymentInvoices;

    if (evt.target.checked) {
      newPaymentInvoices = unpaidInvoices.map((i) => ({
        invoiceId: i.id,
        amount: i.totalCharged.toFixed(2),
      }));
    } else {
      newPaymentInvoices = [];
    }

    props.setPayment({
      ...props.payment,
      invoices: newPaymentInvoices,
      paymentAmount: totalPaymentAmount(newPaymentInvoices),
    });
  }

  function updatePaymentAmount(evt, invoice) {
    let newPaymentInvoices;
    const amount = evt.target.value;

    if (amount === "" || amount === 0) {
      newPaymentInvoices = props.payment.invoices.filter(
        (i) => i.invoiceId !== invoice.id
      );
    } else if (props.payment.invoices.some((i) => i.invoiceId === invoice.id)) {
      newPaymentInvoices = props.payment.invoices.map((i) => {
        if (i.invoiceId === invoice.id) {
          return {
            invoiceId: i.invoiceId,
            amount: amount,
          };
        } else {
          return i;
        }
      });
    } else {
      newPaymentInvoices = props.payment.invoices.concat({
        invoiceId: invoice.id,
        amount,
      });
    }

    props.setPayment({
      ...props.payment,
      invoices: newPaymentInvoices,
      paymentAmount: totalPaymentAmount(newPaymentInvoices),
    });
  }

  function handleBlur(invoice, invoicePayment) {
    if (invoicePayment && invoice.totalCharged < invoicePayment.amount) {
      const newPaymentInvoices = props.payment.invoices.map((i) => {
        if (i.invoiceId === invoice.id) {
          return {
            invoiceId: invoice.id,
            amount: invoice.totalCharged.toFixed(2),
          };
        } else {
          return i;
        }
      });
      props.setPayment({
        ...props.payment,
        invoices: newPaymentInvoices,
        paymentAmount: totalPaymentAmount(newPaymentInvoices),
      });
    }
  }

  function updateDonationAmount(evt) {
    setDonationAmount(evt.target.value);
  }

  function updateOtherAmount(evt) {
    setOtherAmount(evt.target.value);
  }

  function totalPaymentAmount(
    invoicePayments: InvoiceSummary[] = props.payment.invoices
  ) {
    const invoice = sumBy<InvoiceSummary>(invoicePayments, (p) =>
      Number(p.amount)
    ) as number;
    const donation = isEmpty(donationAmount) ? 0 : Number(donationAmount);
    const other = isEmpty(otherAmount) ? 0 : Number(otherAmount);
    return invoice + donation + other;
  }
}
