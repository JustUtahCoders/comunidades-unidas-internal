import React from "react";
import css from "./edit-payment-info.css";
import { CreatePaymentStepProps } from "../create-payment.component";
import SingleClientSearchInput from "../../../client-search/single-client/single-client-search-input.component";
import { useCss, always } from "kremling";
import { isEqual, noop } from "lodash-es";
import {
  humanReadablePaymentType,
  PaymentType,
} from "../edit-payment.component";
import dayjs from "dayjs";

export default function EditPaymentInfo(props: CreatePaymentStepProps) {
  const clientRef = React.useRef();
  // @ts-ignore
  const clientId = clientRef.current ? clientRef.current.id : null;

  React.useEffect(() => {
    if (clientId && !isEqual(props.payment.payerClientIds, [clientId]))
      props.setPayment({ ...props.payment, payerClientIds: [clientId] });
  }, [clientId, props.payment.payerClientIds]);

  return (
    <div
      {...useCss(css)}
      className={always("container").maybe("edit", props.edit)}
    >
      <div className="question">Who made the payment?</div>
      {!props.isDetached && (
        <SingleClientSearchInput
          autoFocus
          initialClient={props.client}
          ref={clientRef}
        />
      )}
      <div {...useCss(css)} className="inputs">
        {props.isDetached && (
          <div>
            <label htmlFor="payer-name">Payer name:</label>
            <input
              id="payer-name"
              type="text"
              value={props.payment.payerName || ""}
              onChange={updateField("payerName")}
            />
          </div>
        )}
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
    </div>
  );

  function updateField(fieldName, transform?) {
    return (evt) => {
      const value = transform ? transform(evt.target.value) : evt.target.value;
      props.setPayment({
        ...props.payment,
        [fieldName]: value,
      });
    };
  }
}
