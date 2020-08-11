import React from "react";
import Modal from "../../util/modal.component";
import { CreatePaymentStepProps } from "./create-payment.component";
import { padStart } from "lodash-es";
import { GrowlType, showGrowl } from "../../growls/growls.component";

export default function ViewPayment(props: CreatePaymentStepProps) {
  const maxHeight = window.innerHeight - (2 * window.innerHeight) / 10 - 140;
  const previewUrl = `/api/payments/${props.payment.id}/receipts`;

  return (
    <Modal
      headerText={`Payment #${padStart(String(props.payment.id), 4, "0")}`}
      primaryText="Print"
      primaryAction={printReceipt}
      secondaryText="Download"
      secondaryAction={downloadReceipt}
      tertiaryText="Edit"
      tertiaryAction={editPayment}
      close={props.proceed}
      wide
    >
      <object
        data={previewUrl}
        type="application/pdf"
        width="100%"
        height={maxHeight + "px"}
      >
        <embed
          src={previewUrl}
          type="application/pdf"
          width="100%"
          height={maxHeight + "px"}
        />
      </object>
    </Modal>
  );

  function printReceipt() {
    window.open(previewUrl, "_blank");
  }

  function downloadReceipt() {
    window.open(`${previewUrl}?download=true`, "_blank");
  }

  function editPayment() {
    showGrowl({
      type: GrowlType.info,
      message: "Editing payments is not yet possible",
    });
  }
}
