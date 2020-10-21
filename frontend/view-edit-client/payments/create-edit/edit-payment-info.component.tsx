import React from "react";
import css from "./edit-payment-info.css";
import { CreatePaymentStepProps } from "../create-payment.component";
import MultiClientSelect, {
  MultiClientSelectRef,
} from "../../../util/multi-client-select.component";
import SingleClientSearchInput from "../../../client-search/single-client/single-client-search-input.component";
import { useCss, always } from "kremling";
import { isEqual, noop } from "lodash-es";
import {
  humanReadablePaymentType,
  PaymentType,
} from "../edit-payment.component";
import dayjs from "dayjs";

export default function EditPaymentInfo(props: CreatePaymentStepProps) {
  // const EditPaymentInfo = React.forwardRef(function (props: CreatePaymentStepProps, ref) {
  // const clientRef = React.useRef();
  const clientRef = React.useRef<MultiClientSelectRef>();
  // @ts-ignore
  let clientIds = clientRef.current ? clientRef.current.getClients() : null;

  React.useEffect(() => {
    if (clientIds)
      props.setPayment({ ...props.payment, payerClientIds: clientIds });
  }, [clientRef.current, clientIds, props.payment.payerClientIds]);

  return (
    <div
      {...useCss(css)}
      className={always("container").maybe("edit", props.edit)}
    >
      <div className="question" onClick={() => console.log(clientIds)}>
        Who made the payment?
      </div>
      <MultiClientSelect initialClients={[props.client]} ref={clientRef} />
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
// )
