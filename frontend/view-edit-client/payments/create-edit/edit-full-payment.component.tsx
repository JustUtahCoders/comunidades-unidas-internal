import React from "react";
import Modal from "../../../util/modal.component";
import { padStart, cloneDeep } from "lodash-es";
import { FullPayment } from "../edit-payment.component";
import EditPaymentInfo from "./edit-payment-info.component";
import { FullInvoice } from "../../invoices/edit-invoice.component";
import { SingleClient } from "../../view-client.component";
import CreatePaymentSelectInvoices from "./create-payment-select-invoices.component";
import easyFetch from "../../../util/easy-fetch";
import { UserModeContext, UserMode } from "../../../util/user-mode.context";
import { showGrowl, GrowlType } from "../../../growls/growls.component";

export default function EditFullPayment(props: EditFullPaymentProps) {
  const [modifiedPayment, setModifiedPayment] = React.useState(
    cloneDeep(props.payment)
  );
  const paymentNumber = padStart(String(props.payment.id), 4, "0");
  const title = `Payment #${paymentNumber}`;
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();

      easyFetch(`/api/payments/${props.payment.id}${tagsQuery}`, {
        method: "PATCH",
        signal: ac.signal,
        body: {
          ...modifiedPayment,
          donationAmount: Number(modifiedPayment.donationAmount),
          invoices: modifiedPayment.invoices.map((i) => ({
            ...i,
            amount: Number(i.amount),
          })),
        },
      })
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: `Payment ${paymentNumber} was saved.`,
          });
          props.paymentEdited();
        })
        .catch((err) => {
          setIsSaving(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => {
        ac.abort();
      };
    }
  }, [isSaving, tagsQuery, paymentNumber]);

  React.useEffect(() => {
    if (isDeleting) {
      const ac = new AbortController();
      easyFetch(`/api/payments/${props.payment.id}`, {
        method: "DELETE",
        signal: ac.signal,
      })
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: `Payment ${paymentNumber} was deleted.`,
          });
          props.paymentEdited();
        })
        .catch((err) => {
          setIsDeleting(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => {
        ac.abort();
      };
    }
  }, [isDeleting, tagsQuery, paymentNumber]);

  return (
    <Modal
      headerText={title}
      primaryText="Save"
      primaryAction={save}
      secondaryText="Back"
      secondaryAction={props.goBack}
      tertiaryText="Delete"
      tertiaryAction={deletePayment}
      close={props.close}
    >
      <>
        <EditPaymentInfo
          payment={modifiedPayment}
          setPayment={setModifiedPayment}
          client={props.client}
          invoices={props.invoices}
          edit
          isDetached={props.isDetached}
        />
        <CreatePaymentSelectInvoices
          payment={modifiedPayment}
          setPayment={setModifiedPayment}
          client={props.client}
          invoices={props.invoices}
          edit
          isDetached={props.isDetached}
        />
      </>
    </Modal>
  );

  function save() {
    setIsSaving(true);
  }

  function deletePayment() {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      setIsDeleting(true);
    }
  }
}

type EditFullPaymentProps = {
  payment: FullPayment;
  client: SingleClient;
  invoices: FullInvoice[];
  goBack(): any;
  paymentEdited(): any;
  close(): any;
  isDetached?: boolean;
};
