import React from "react";
import { SingleClient } from "../view-client.component";
import css from "./client-invoices.css";
import { useCss } from "kremling";

export default function ClientInvoices(props: ClientInvoicesProps) {
  const [apiState, dispatchApiState] = React.useReducer(
    reducer,
    initialApiState
  );

  return (
    <div className="card" {...useCss(css)}>
      <div className="section-header">
        <h1>Invoices</h1>
        <button className="secondary">Create Invoice</button>
      </div>
      <section></section>
      <div className="section-header">
        <h1>Payments</h1>
        <button className="secondary">Create Payment</button>
      </div>
    </div>
  );
}

function reducer(state: ApiState, action: Action): ApiState {
  return state;
}

type ClientInvoicesProps = {
  path: string;
  clientId: string;
  client: SingleClient;
  navigate?: (path) => any;
};

type PaymentSummary = {};

type Action = {};

enum ApiStatus {
  shouldLoad = "shouldLoad",
  loading = "loading",
  loaded = "loaded",
  error = "error",
}

type InvoiceSummary = {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  clientNote: string;
  totalCharged: number;
};

type ApiState = {
  invoices: Array<InvoiceSummary>;
  payments: Array<PaymentSummary>;
  invoiceStatus: ApiStatus;
  paymentStatus: ApiStatus;
};

const initialApiState: ApiState = {
  invoices: [],
  payments: [],
  invoiceStatus: ApiStatus.shouldLoad,
  paymentStatus: ApiStatus.shouldLoad,
};
