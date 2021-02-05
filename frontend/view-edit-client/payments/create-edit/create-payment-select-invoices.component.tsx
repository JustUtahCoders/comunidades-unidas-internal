import React from "react";
import css from "./create-payment-select-invoices.css";
import { CreatePaymentStepProps } from "../create-payment.component";
import { useCss, always } from "kremling";
import { InvoiceSummary } from "../edit-payment.component";
import { InvoiceStatus } from "../../invoices/client-invoices.component";
import { sumBy, intersectionBy, isEmpty } from "lodash-es";
import { FullInvoice } from "../../invoices/edit-invoice.component";

export default function CreatePaymentSelectInvoices(
  props: CreatePaymentStepProps
) {
  const [existingInvoiceRows] = React.useState(() =>
    props.payment.invoices
      .map((i) => props.invoices.find((j) => j.id === i.invoiceId))
      .map((i) => ({
        ...i,
        payments: i.payments.filter((p) => p.paymentId !== props.payment.id),
      }))
  );
  const unpaidInvoices = props.invoices.filter(
    (i) =>
      (i.status === InvoiceStatus.open || i.status === InvoiceStatus.draft) &&
      !i.redacted &&
      !existingInvoiceRows.some((j) => j.id === i.id)
  );
  const invoiceRows = existingInvoiceRows.concat(unpaidInvoices);
  const [otherAmount, setOtherAmount] = React.useState(() => calcOtherAmount());

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
      {invoiceRows.length > 0 && (
        <>
          <p className={always("invoice-header").maybe("edit", props.edit)}>
            Which invoices should this payment be applied to?
          </p>
          <div className="invoices">
            <table>
              <caption>Outstanding Invoices</caption>
              <thead>
                <tr>
                  <th style={{ width: "4rem" }}>
                    <input
                      type="checkbox"
                      checked={
                        pendingInvoicePayments.length === invoiceRows.length
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
                {invoiceRows
                  .filter((invoice) => invoice.totalCharged)
                  .map((invoice) => {
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
                          {(
                            invoice.totalCharged -
                            sumBy(invoice.payments, "amountTowardsInvoice")
                          ).toFixed(2)}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="$0.00"
                            value={invoicePayment ? invoicePayment.amount : ""}
                            onChange={(evt) =>
                              updatePaymentAmount(evt, invoice)
                            }
                            onBlur={() => handleBlur(invoice, invoicePayment)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!props.edit && <p>Any donations or other payments?</p>}
      <div className="other-payments">
        <div>
          <label htmlFor="donation-amount">Donation:</label>
          <input
            type="number"
            step="0.01"
            placeholder="$0.00"
            id="donation-amount"
            value={props.payment.donationAmount || ""}
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
      // @ts-ignore
      newPaymentInvoices = props.payment.invoices.concat({
        invoiceId: invoice.id,
        amount: restOfInvoice(invoice).toFixed(2),
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
      newPaymentInvoices = invoiceRows.map((i) => ({
        invoiceId: i.id,
        amount: restOfInvoice(i).toFixed(2),
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

  function handleBlur(invoice: FullInvoice, invoicePayment) {
    if (invoicePayment && restOfInvoice(invoice) < invoicePayment.amount) {
      const newPaymentInvoices: InvoiceSummary[] = props.payment.invoices.map(
        (i) => {
          if (i.invoiceId === invoice.id) {
            return {
              invoiceId: invoice.id,
              amount: (restOfInvoice(invoice).toFixed(2) as unknown) as number,
            };
          } else {
            return i;
          }
        }
      );
      props.setPayment({
        ...props.payment,
        invoices: newPaymentInvoices,
        paymentAmount: totalPaymentAmount(newPaymentInvoices),
      });
    }
  }

  function updateDonationAmount(evt) {
    props.setPayment({
      ...props.payment,
      donationAmount: evt.target.value,
    });
  }

  function updateOtherAmount(evt) {
    setOtherAmount(evt.target.value);
  }

  function totalPaymentAmount(
    invoicePayments: InvoiceSummary[] = props.payment.invoices
  ) {
    const invoice = totalInvoiceAmount(invoicePayments);
    const donation = props.payment.donationAmount
      ? Number(props.payment.donationAmount)
      : 0;
    const other = otherAmount ? Number(otherAmount) : 0;
    return invoice + donation + other;
  }

  function calcOtherAmount() {
    const donation = props.payment.donationAmount
      ? props.payment.donationAmount
      : 0;
    const other =
      props.payment.paymentAmount -
      donation -
      totalInvoiceAmount(props.payment.invoices);
    if (other === 0) {
      return "";
    } else {
      return other;
    }
  }

  function totalInvoiceAmount(
    invoicePayments: InvoiceSummary[] = props.payment.invoices
  ) {
    return sumBy<InvoiceSummary>(invoicePayments, (p) =>
      Number(p.amount)
    ) as number;
  }
}

function restOfInvoice(invoice: FullInvoice): number {
  return invoice.totalCharged - sumBy(invoice.payments, "amountTowardsInvoice");
}
