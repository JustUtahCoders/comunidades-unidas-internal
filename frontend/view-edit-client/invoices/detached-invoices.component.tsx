import React from "react";
import easyFetch from "../../util/easy-fetch";
import InvoiceHome from "./invoice-home.component";
import { FullInvoice } from "./edit-invoice.component";
import { FullPayment } from "../payments/edit-payment.component";
import { CUService } from "../../add-client/services.component";
import PageHeader from "../../page-header.component";
import { UserModeContext, UserMode } from "../../util/user-mode.context";

export default function DetachedInvoices(props: DetachedInvoicesProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";

  React.useEffect(() => {
    if (state.invoiceStatus === ApiStatus.shouldLoad) {
      const ac = new AbortController();
      easyFetch(`/api/detached-invoices${tagsQuery}`, {
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

  React.useEffect(() => {
    if (state.paymentStatus === ApiStatus.shouldLoad) {
      const ac = new AbortController();
      easyFetch(`/api/detached-payments${tagsQuery}`, {
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
  }, [state.paymentStatus, tagsQuery]);

  return (
    <>
      <PageHeader title="Invoices" />
      <InvoiceHome
        invoiceStatus={state.invoiceStatus}
        invoices={state.invoices}
        payments={state.payments}
        paymentStatus={state.paymentStatus}
        refetchInvoices={refetchInvoices}
        refetchPayments={refetchPayments}
        services={state.services}
        isDetached
      />
    </>
  );

  function refetchInvoices() {
    dispatch({
      type: ActionTypes.fetchInvoices,
    });
  }

  function refetchPayments() {
    dispatch({
      type: ActionTypes.fetchPayments,
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
    case ActionTypes.fetchPayments:
      return {
        ...state,
        paymentStatus: ApiStatus.shouldLoad,
        invoiceStatus: ApiStatus.shouldLoad,
      };
  }
}

enum ActionTypes {
  newInvoices = "newInvoices",
  invoiceError = "invoiceError",
  newPayments = "newPayments",
  paymentsError = "paymentsError",
  setServices = "setServices",
  fetchInvoices = "fetchInvoices",
  fetchPayments = "fetchPayments",
  userModeChanged = "userModeChanged",
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
  payments: Array<FullPayment>;
};

type PaymentsError = {
  type: ActionTypes.paymentsError;
};

type SetServices = {
  type: ActionTypes.setServices;
  services: CUService[];
};

type FetchInvoices = {
  type: ActionTypes.fetchInvoices;
};

type FetchPayments = {
  type: ActionTypes.fetchPayments;
};

type Action =
  | NewInvoices
  | InvoiceError
  | NewPayments
  | PaymentsError
  | SetServices
  | FetchInvoices
  | FetchPayments;

type State = {
  invoices: Array<FullInvoice>;
  payments: Array<FullPayment>;
  invoiceStatus: ApiStatus;
  paymentStatus: ApiStatus;
  services: CUService[];
};

enum ApiStatus {
  shouldLoad = "shouldLoad",
  loading = "loading",
  loaded = "loaded",
  error = "error",
}

type DetachedInvoicesProps = {
  path?: string;
};

const initialState: State = {
  invoiceStatus: ApiStatus.shouldLoad,
  invoices: [],
  paymentStatus: ApiStatus.shouldLoad,
  payments: [],
  services: [],
};
