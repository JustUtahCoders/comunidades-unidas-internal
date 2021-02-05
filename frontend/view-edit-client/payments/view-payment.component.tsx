import React from "react";
import Modal from "../../util/modal.component";
import { CreatePaymentStepProps } from "./create-payment.component";
import { padStart } from "lodash-es";
import { UserModeContext, UserMode } from "../../util/user-mode.context";
import dayjs from "dayjs";
import EditFullPayment from "./create-edit/edit-full-payment.component";

export default function ViewPayment(props: CreatePaymentStepProps) {
  const maxHeight = window.innerHeight - (2 * window.innerHeight) / 10 - 140;
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";
  const previewUrl = `/api/payments/${props.payment.id}/receipts${tagsQuery}`;
  const paymentNumber = padStart(String(props.payment.id), 4, "0");
  const title = `Payment #${paymentNumber}`;
  const [isEditing, setIsEditing] = React.useState(false);

  if (props.payment.redacted) {
    return (
      <Modal
        headerText={title}
        primaryText="Done"
        primaryAction={props.proceed}
        close={props.proceed}
      >
        <div>
          Payment #{paymentNumber} has been redacted. It was created by{" "}
          {props.payment.createdBy.fullName} on{" "}
          {dayjs(props.payment.createdBy.timestamp).format("MMMM DD, YYYY")} and
          last updated by {props.payment.modifiedBy.fullName} on{" "}
          {dayjs(props.payment.modifiedBy.timestamp).format("MMMM DD, YYYY")}.
        </div>
      </Modal>
    );
  }

  if (isEditing) {
    return (
      <EditFullPayment
        close={props.proceed}
        paymentEdited={paymentEdited}
        payment={props.payment}
        invoices={props.invoices}
        goBack={cancelEdit}
        client={props.client}
        isDetached={props.isDetached}
      />
    );
  }

  return (
    <Modal
      headerText={title}
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
    const conjunction = previewUrl.includes("?") ? "&" : "?";
    window.open(`${previewUrl}${conjunction}download=true`, "_blank");
  }

  function editPayment() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  function paymentEdited() {
    if (props.refetchPayments) {
      props.refetchPayments();
    }
    props.proceed();
  }
}
