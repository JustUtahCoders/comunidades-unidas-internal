import React from "react";
import Modal from "../../../util/modal.component";
import { padStart } from "lodash-es";
import { FullPayment } from "../edit-payment.component";

export default function EditFullPayment(props: EditFullPaymentProps) {
  const paymentNumber = padStart(String(props.payment.id), 4, "0");
  const title = `Payment #${paymentNumber}`;

  return (
    <Modal
      headerText={title}
      primaryText="Save"
      primaryAction={save}
      secondaryText="Back"
      secondaryAction={props.goBack}
      close={props.close}
    >
      <div>A payment!</div>
    </Modal>
  );

  function save() {}
}

type EditFullPaymentProps = {
  payment: FullPayment;
  goBack(): any;
  close(): any;
};
