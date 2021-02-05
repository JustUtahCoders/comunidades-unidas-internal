import React from "react";
import css from "./invoice-home.css";
import { useCss } from "kremling";
import CreateInvoice from "./create-invoice.component";
import CreatePayment from "../payments/create-payment.component";
import { FullInvoice } from "./edit-invoice.component";
import { FullPayment } from "../payments/edit-payment.component";
import PinwheelLoader from "../../util/pinwheel-loader.component";
import EmptyState from "../../util/empty-state/empty-state.component";
import { SingleClient } from "../view-client.component";
import InvoiceList from "./invoice-list.component";
import PaymentsList from "../payments/payments-list.component";
import { CUService } from "../../add-client/services.component";

export default function InvoiceHome(props: InvoiceHomeProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div {...useCss(css)}>
      <div className="card">
        {props.isDetached && (
          <p className="reminder">
            REMINDER: If you're billing a C.U. client, do NOT create the invoice
            here. Instead, go to the client record and create the invoice there.
            This helps us keep track of the invoices correctly. Only create
            invoices here when billing a business or person who is not a C.U.
            client.
          </p>
        )}
        <div className="section-header">
          <h1>Invoices</h1>
          <button className="secondary" onClick={createInvoice}>
            Create Invoice
          </button>
        </div>
        <section className="table-container">{invoicesTable()}</section>
      </div>
      <div className="card">
        <div className="section-header">
          <h1>Payments</h1>
          <button
            className="secondary"
            onClick={() => dispatch({ type: ActionTypes.createPayment })}
          >
            Create Payment
          </button>
        </div>
        <section className="table-container">{paymentsTable()}</section>
        {state.creatingInvoice && (
          <CreateInvoice
            close={() => dispatch({ type: ActionTypes.cancelCreateInvoice })}
            client={props.client}
            services={props.services || []}
            refetchInvoices={props.refetchInvoices}
            isDetached={props.isDetached}
          />
        )}
        {state.creatingPayment && (
          <CreatePayment
            client={props.client}
            clientInvoices={props.invoices}
            close={() => dispatch({ type: ActionTypes.cancelCreatePayment })}
            refetchPayments={props.refetchPayments}
            isDetached={props.isDetached}
          />
        )}
      </div>
    </div>
  );

  function createInvoice() {
    dispatch({
      type: ActionTypes.createInvoice,
    });
  }

  function invoicesTable() {
    switch (props.invoiceStatus) {
      case ApiStatus.shouldLoad:
      case ApiStatus.loading:
        return <PinwheelLoader />;
      case ApiStatus.loaded:
        if (props.invoices.length === 0) {
          return <EmptyState pluralName="invoices" />;
        } else {
          return (
            <InvoiceList
              invoices={props.invoices}
              client={props.client}
              services={props.services}
              refetchInvoices={props.refetchInvoices}
              isDetached={props.isDetached}
            />
          );
        }
      case ApiStatus.error:
        return "Error loading invoices";
      default:
        throw Error(props.invoiceStatus);
    }
  }

  function paymentsTable() {
    switch (props.paymentStatus) {
      case ApiStatus.shouldLoad:
      case ApiStatus.loading:
        return <PinwheelLoader />;
      case ApiStatus.loaded:
        if (props.payments.length === 0) {
          return <EmptyState pluralName="payments" />;
        } else {
          return (
            <PaymentsList
              client={props.client}
              invoices={props.invoices}
              payments={props.payments}
              refetchPayments={props.refetchPayments}
              isDetached={props.isDetached}
            />
          );
        }
      case ApiStatus.error:
        return "Error loading payments";
      default:
        throw Error(props.paymentStatus);
    }
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.createInvoice:
      return {
        ...state,
        creatingInvoice: true,
        creatingPayment: false,
      };
    case ActionTypes.cancelCreateInvoice:
      return {
        ...state,
        creatingInvoice: false,
      };
    case ActionTypes.createPayment:
      return {
        ...state,
        creatingPayment: true,
        creatingInvoice: false,
      };
    case ActionTypes.cancelCreatePayment:
      return {
        ...state,
        creatingPayment: false,
      };
    default:
      throw Error();
  }
}

enum ActionTypes {
  createInvoice = "createInvoice",
  cancelCreateInvoice = "cancelCreateInvoice",
  createPayment = "createPayment",
  cancelCreatePayment = "cancelCreatePayment",
}

type CreateInvoiceAction = {
  type: ActionTypes.createInvoice;
};

type CancelCreateInvoice = {
  type: ActionTypes.cancelCreateInvoice;
};

type CreatePaymentAction = {
  type: ActionTypes.createPayment;
};

type CancelCreatePayment = {
  type: ActionTypes.cancelCreatePayment;
};

type Action =
  | CreateInvoiceAction
  | CancelCreateInvoice
  | CreatePaymentAction
  | CancelCreatePayment;

enum ApiStatus {
  shouldLoad = "shouldLoad",
  loading = "loading",
  loaded = "loaded",
  error = "error",
}

type InvoiceHomeProps = {
  invoiceStatus: ApiStatus;
  paymentStatus: ApiStatus;
  refetchInvoices(): any;
  refetchPayments(): any;
  client?: SingleClient;
  invoices: FullInvoice[];
  payments: FullPayment[];
  services: CUService[];
  isDetached?: boolean;
};

type State = {
  creatingInvoice: boolean;
  creatingPayment: boolean;
};

const initialState: State = {
  creatingInvoice: false,
  creatingPayment: false,
};
