import React from "react";
import css from "./create-payment-amount.css";
import { CreatePaymentStepProps } from "../create-payment.component";
import { useCss } from "kremling";
import {
  PaymentType,
  humanReadablePaymentType,
} from "../edit-payment.component";
import { noop } from "lodash-es";
import dayjs from "dayjs";

export default function CreatePaymentAmount(props: CreatePaymentStepProps) {
  return (
    <div {...useCss(css)} className="inputs">
      <div>
        <label htmlFor="payment-date">Payment Date:</label>
        <input
          type="date"
          id="payment-date"
          value={dayjs(props.payment.paymentDate).format("YYYY-MM-DD")}
          onChange={updateField("paymentDate")}
          required
        />
      </div>
      <div>
        <label htmlFor="payment-amount">Amount:</label>
        <input
          type="number"
          id="payment-amount"
          min="0.01"
          step="0.01"
          value={props.payment.paymentAmount}
          onChange={updateField("paymentAmount", Number)}
          required
          placeholder="$0.00"
        />
      </div>
      <div>
        <label htmlFor="paid-with">Paid With:</label>
        <select
          id="paid-with"
          value={props.payment.paymentType}
          onChange={updateField("paymentType")}
        >
          {Object.keys(PaymentType).map((paymentType) => (
            <option key={paymentType} value={paymentType}>
              {humanReadablePaymentType(paymentType as PaymentType)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  function updateField(fieldName, transform = noop) {
    return (evt) => {
      props.setPayment({
        ...props.payment,
        [fieldName]: transform(evt.target.value),
      });
    };
  }
}
