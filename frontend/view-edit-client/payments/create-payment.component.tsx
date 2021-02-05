import React from "react";
import { SingleClient } from "../view-client.component";
import Modal from "../../util/modal.component";
import { PaymentType, FullPayment } from "./edit-payment.component";
import { FullInvoice } from "../invoices/edit-invoice.component";
import CreatePaymentCheckInvoices from "./create-edit/create-payment-check-invoices.component";
import EditPaymentInfo from "./create-edit/edit-payment-info.component";
import CreatePaymentSelectInvoices from "./create-edit/create-payment-select-invoices.component";
import CreatePaymentConfirmation from "./create-edit/create-payment-confirmation.component";
import { InvoiceStatus } from "../invoices/client-invoices.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import dayjs from "dayjs";
import ViewPayment from "./view-payment.component";
import { UserModeContext, UserMode } from "../../util/user-mode.context";

export default function CreatePayment(props: CreatePaymentProps) {
  const [payment, setPayment] = React.useState<FullPayment>(
    emptyPayment(props.client?.id)
  );
  const [step, setStep] = React.useState<Step>(Step.checkInvoices);
  const StepComponent = StepComponents[step];
  const [isCreating, setIsCreating] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";

  React.useEffect(() => {
    if (isCreating) {
      const ac = new AbortController();
      easyFetch(`/api/payments${tagsQuery}`, {
        method: "POST",
        signal: ac.signal,
        body: {
          ...payment,
          paymentDate: dayjs(payment.paymentDate).format("YYYY-MM-DD"),
          invoices: payment.invoices.map((i) => ({
            ...i,
            amount: Number(i.amount),
          })),
          donationAmount: payment.donationAmount
            ? Number(payment.donationAmount)
            : null,
        },
      })
        .then((payment) => {
          showGrowl({
            type: GrowlType.success,
            message: `Payment created`,
          });
          setPayment(payment);
          props.refetchPayments();
          setStep(Step.viewPayment);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
          setIsCreating(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [isCreating, tagsQuery]);

  if (step === Step.viewPayment) {
    return (
      <ViewPayment
        payment={payment}
        setPayment={setPayment}
        proceed={proceed}
        invoices={props.clientInvoices}
        client={props.client}
        isDetached={props.isDetached}
      />
    );
  } else {
    return (
      <Modal
        primaryText={StepComponent.nextButtonText || "Next Step"}
        primaryAction={handleSubmit}
        primarySubmit
        primaryDisabled={isCreating}
        secondaryText={StepComponent.backButtonText || "Back"}
        secondaryAction={back}
        headerText="Create Payment"
        customHeaderContent={customHeaderContent()}
        close={props.close}
      >
        <StepComponent
          payment={payment}
          setPayment={setPayment}
          proceed={proceed}
          invoices={props.clientInvoices}
          client={props.client}
          isDetached={props.isDetached}
        />
      </Modal>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    proceed();
  }

  function proceed() {
    if (step === Step.viewPayment) {
      props.close();
    } else if (step === Step.confirm) {
      setIsCreating(true);
    } else {
      setStep(nextStep(step));
    }
  }

  function back() {
    if (
      step === Step.checkInvoices ||
      (step === Step.paymentInfo &&
        props.clientInvoices.filter(
          (i) =>
            i.status === InvoiceStatus.draft || i.status === InvoiceStatus.open
        ).length > 0)
    ) {
      props.close();
    } else {
      setStep(previousStep(step));
    }
  }

  function customHeaderContent() {
    if (step === Step.checkInvoices || step === Step.paymentInfo) {
      return null;
    } else {
      return (
        <span style={{ fontStyle: "bold" }}>
          ${Number(payment.paymentAmount).toFixed(2)}
        </span>
      );
    }
  }
}

function nextStep(step) {
  switch (step) {
    case Step.checkInvoices:
      return Step.paymentInfo;
    case Step.paymentInfo:
      return Step.selectInvoices;
    case Step.selectInvoices:
      return Step.confirm;
  }
}

function previousStep(step) {
  switch (step) {
    case Step.paymentInfo:
      return Step.checkInvoices;
    case Step.selectInvoices:
      return Step.paymentInfo;
    case Step.confirm:
      return Step.selectInvoices;
  }
}

function emptyPayment(initialClientId: number): FullPayment {
  return {
    id: -1,
    paymentDate: new Date().toISOString(),
    invoices: [],
    paymentAmount: 0,
    paymentType: PaymentType.credit,
    payerClientIds: initialClientId ? [initialClientId] : [],
    redacted: false,
    payerName: null,
  };
}

type CreatePaymentProps = {
  client: SingleClient;
  clientInvoices: FullInvoice[];
  close(): any;
  refetchPayments(): any;
  isDetached?: boolean;
};

enum Step {
  checkInvoices = "checkInvoices",
  paymentInfo = "paymentInfo",
  selectInvoices = "selectInvoices",
  confirm = "confirm",
  viewPayment = "viewPayment",
}

const StepComponents: StepComps = {
  [Step.checkInvoices]: CreatePaymentCheckInvoices,
  [Step.paymentInfo]: EditPaymentInfo,
  [Step.selectInvoices]: CreatePaymentSelectInvoices,
  [Step.confirm]: CreatePaymentConfirmation,
  [Step.viewPayment]: ViewPayment,
};

interface StepComponent {
  (props: CreatePaymentStepProps): JSX.Element;
  nextButtonText?: string;
  backButtonText?: string;
}

type StepComps = {
  [key: string]: StepComponent;
};

export type CreatePaymentStepProps = {
  payment: FullPayment;
  invoices: FullInvoice[];
  setPayment(payment: FullPayment): any;
  proceed?(): any;
  edit?: boolean;
  refetchPayments?(): any;
  client: SingleClient;
  isDetached?: boolean;
};
