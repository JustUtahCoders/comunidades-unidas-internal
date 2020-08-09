import React from "react";
import { SingleClient } from "../view-client.component";
import css from "./client-invoices.css";
import { useCss } from "kremling";
import PinwheelLoader from "../../util/pinwheel-loader.component";
import EmptyState from "../../util/empty-state/empty-state.component";
import easyFetch from "../../util/easy-fetch";
import CreateInvoice from "./create-invoice.component";
import { CUService } from "../../add-client/services.component";
import ClientInvoiceList from "./client-invoice-list.component";
import { FullInvoice } from "./edit-invoice.component";

export default function ClientInvoices(props: ClientInvoicesProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (state.invoiceStatus === ApiStatus.shouldLoad) {
      const ac = new AbortController();
      easyFetch(`/api/clients/${props.clientId}/invoices`, {
        signal: ac.signal,
      }).then(
        (data) => {
          dispatch({
            type: ActionTypes.newInvoices,
            invoices: data.invoices,
          });
        },
        (err) => {
          dispatch({
            type: ActionTypes.invoiceError,
          });
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => {
        ac.abort();
      };
    }
  }, [state.invoiceStatus]);

  React.useEffect(() => {
    if (state.paymentStatus === ApiStatus.shouldLoad) {
      const ac = new AbortController();
      easyFetch(`/api/clients/${props.clientId}/payments`, {
        signal: ac.signal,
      }).then(
        (data) => {
          dispatch({
            type: ActionTypes.newPayments,
            payments: data.payments,
          });
        },
        (err) => {
          dispatch({
            type: ActionTypes.paymentsError,
          });
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => {
        ac.abort();
      };
    }
  }, [state.payments]);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/services`).then(
      (data) =>
        dispatch({ type: ActionTypes.setServices, services: data.services }),
      (err) => {
        setTimeout(() => {
          throw err;
        });
      }
    );
  }, []);

  return (
    <div {...useCss(css)}>
      <div className="card">
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
          <button className="secondary">Create Payment</button>
        </div>
        <section className="table-container">{paymentsTable()}</section>
        {state.creatingInvoice && (
          <CreateInvoice
            close={() => dispatch({ type: ActionTypes.cancelCreateInvoice })}
            client={props.client}
            services={state.services || []}
            refetchInvoices={refetchInvoices}
          />
        )}
      </div>
    </div>
  );

  function invoicesTable() {
    switch (state.invoiceStatus) {
      case ApiStatus.shouldLoad:
      case ApiStatus.loading:
        return <PinwheelLoader />;
      case ApiStatus.loaded:
        if (state.invoices.length === 0) {
          return <EmptyState pluralName="invoices" />;
        } else {
          return (
            <ClientInvoiceList
              invoices={state.invoices}
              client={props.client}
              services={state.services}
              refetchInvoices={refetchInvoices}
            />
          );
        }
      case ApiStatus.error:
        return "Error loading invoices";
      default:
        throw Error(state.invoiceStatus);
    }
  }

  function refetchInvoices() {
    dispatch({
      type: ActionTypes.fetchInvoices,
    });
  }

  function paymentsTable() {
    switch (state.paymentStatus) {
      case ApiStatus.shouldLoad:
      case ApiStatus.loading:
        return <PinwheelLoader />;
      case ApiStatus.loaded:
        if (state.invoices.length === 0) {
          return <EmptyState pluralName="payments" />;
        } else {
          return null;
        }
      case ApiStatus.error:
        return "Error loading payments";
      default:
        throw Error(state.paymentStatus);
    }
  }

  function createInvoice() {
    dispatch({
      type: ActionTypes.createInvoice,
    });
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.newInvoices:
      return {
        ...state,
        invoiceStatus: ApiStatus.loaded,
        invoices: action.invoices,
      };
    case ActionTypes.invoiceError:
      return {
        ...state,
        invoiceStatus: ApiStatus.error,
        invoices: [],
      };
    case ActionTypes.newPayments:
      return {
        ...state,
        paymentStatus: ApiStatus.loaded,
        payments: action.payments,
      };
    case ActionTypes.paymentsError:
      return {
        ...state,
        paymentStatus: ApiStatus.error,
      };
    case ActionTypes.createInvoice:
      return {
        ...state,
        creatingInvoice: true,
      };
    case ActionTypes.cancelCreateInvoice:
      return {
        ...state,
        creatingInvoice: false,
      };
    case ActionTypes.setServices:
      return {
        ...state,
        services: action.services,
      };
    case ActionTypes.fetchInvoices:
      return {
        ...state,
        invoiceStatus: ApiStatus.shouldLoad,
      };
    default:
      throw Error();
  }
}

type ClientInvoicesProps = {
  path: string;
  clientId: string;
  client: SingleClient;
  navigate?: (path) => any;
};

type PaymentSummary = {};

enum ActionTypes {
  newInvoices = "newInvoices",
  invoiceError = "invoiceError",
  newPayments = "newPayments",
  paymentsError = "paymentsError",
  createInvoice = "createInvoice",
  cancelCreateInvoice = "cancelCreateInvoice",
  setServices = "setServices",
  fetchInvoices = "fetchInvoices",
}

type NewInvoices = {
  type: ActionTypes.newInvoices;
  invoices: Array<FullInvoice>;
};

type InvoiceError = {
  type: ActionTypes.invoiceError;
};

type NewPayments = {
  type: ActionTypes.newPayments;
  payments: Array<PaymentSummary>;
};

type PaymentsError = {
  type: ActionTypes.paymentsError;
};

type CreateInvoiceAction = {
  type: ActionTypes.createInvoice;
};

type CancelCreateInvoice = {
  type: ActionTypes.cancelCreateInvoice;
};

type SetServices = {
  type: ActionTypes.setServices;
  services: CUService[];
};

type FetchInvoices = {
  type: ActionTypes.fetchInvoices;
};

type Action =
  | NewInvoices
  | InvoiceError
  | NewPayments
  | PaymentsError
  | CreateInvoiceAction
  | CancelCreateInvoice
  | SetServices
  | FetchInvoices;

enum ApiStatus {
  shouldLoad = "shouldLoad",
  loading = "loading",
  loaded = "loaded",
  error = "error",
}

export enum InvoiceStatus {
  draft = "draft",
  open = "open",
  completed = "completed",
  closed = "closed",
}

type State = {
  invoices: Array<FullInvoice>;
  payments: Array<PaymentSummary>;
  invoiceStatus: ApiStatus;
  paymentStatus: ApiStatus;
  creatingInvoice: boolean;
  services: CUService[];
};

const initialState: State = {
  invoices: [],
  payments: [],
  invoiceStatus: ApiStatus.shouldLoad,
  paymentStatus: ApiStatus.shouldLoad,
  creatingInvoice: false,
  services: [],
};
