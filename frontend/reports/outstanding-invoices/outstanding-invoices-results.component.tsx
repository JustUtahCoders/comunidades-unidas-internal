import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { formatPhone } from "../../util/formatters";
import { Link } from "@reach/router";
import { UserModeContext, UserMode } from "../../util/user-mode.context";

export default function InteractionHoursByClientResults(props) {
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery = userMode === UserMode.immigration ? `tags=immigration` : "";
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/outstanding-invoices`,
    tagsQuery
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred.</div>;
  }

  const {
    outstandingSummary,
    completedSummary,
    outstandingInvoices,
    clientsWhoOwe,
  } = data.results;

  return (
    <div>
      <BasicTableReport
        title="Outstanding Invoices Report"
        headerRows={
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <th>Start Date</th>
              <td>
                {data.reportParameters.start
                  ? dayjs(data.reportParameters.start).format("MMM D, YYYY")
                  : "\u2014"}
              </td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>
                {data.reportParameters.end
                  ? dayjs(data.reportParameters.end).format("MMM D, YYYY")
                  : "\u2014"}
              </td>
            </tr>
          </>
        }
      />
      <div style={{ position: "relative" }}>
        <BasicTableReport
          title="Summary"
          headerRows={
            <tr>
              <th></th>
              <th>Total Charged</th>
              <th>Total Paid</th>
              <th>Outstanding Balance</th>
            </tr>
          }
          contentRows={
            <>
              <tr>
                <th>Outstanding Invoices</th>
                <td>${outstandingSummary.totalCharged.toFixed(2)}</td>
                <td>${outstandingSummary.totalPaid.toFixed(2)}</td>
                <td>
                  $
                  {(
                    outstandingSummary.totalCharged -
                    outstandingSummary.totalPaid
                  ).toFixed(2)}
                </td>
              </tr>
              <tr>
                <th>Completed Invoices</th>
                <td>${completedSummary.totalCharged.toFixed(2)}</td>
                <td>${completedSummary.totalPaid.toFixed(2)}</td>
                <td>
                  $
                  {(
                    completedSummary.totalCharged - completedSummary.totalPaid
                  ).toFixed(2)}
                </td>
              </tr>
            </>
          }
          footerRows={
            <tr>
              <th>Total</th>
              <td>
                $
                {(
                  completedSummary.totalCharged +
                  outstandingSummary.totalCharged
                ).toFixed(2)}
              </td>
              <td>
                $
                {(
                  completedSummary.totalPaid + outstandingSummary.totalPaid
                ).toFixed(2)}
              </td>
              <td>
                $
                {(
                  outstandingSummary.totalCharged - outstandingSummary.totalPaid
                ).toFixed(2)}
              </td>
            </tr>
          }
        />
        <BasicTableReport
          title="Outstanding Invoices"
          headerRows={
            <tr>
              <th>Invoice #</th>
              <th>Clients</th>
              <th>Charged</th>
              <th>Paid</th>
              <th>Balance</th>
            </tr>
          }
          contentRows={
            <>
              {outstandingInvoices.map((invoice) => {
                const firstClient = invoice.clientsWhoOwe[0];
                return (
                  <tr key={invoice.id}>
                    <td>
                      <Link
                        to={`/clients/${firstClient.clientId}/invoices?invoice=${invoice.id}`}
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td>
                      {invoice.clientsWhoOwe.map((c) => (
                        <Link to={`/clients/${c.clientId}`} key={c.clientId}>
                          {c.fullName}
                        </Link>
                      ))}
                    </td>
                    <td>
                      {maybeRedacted(invoice.redacted, invoice.totalCharged)}
                    </td>
                    <td>
                      {maybeRedacted(invoice.redacted, invoice.totalPaid)}
                    </td>
                    <td>
                      {maybeRedacted(
                        invoice.redacted,
                        invoice.totalCharged - invoice.totalPaid
                      )}
                    </td>
                  </tr>
                );
              })}
            </>
          }
        />
        <BasicTableReport
          title="Clients Who Owe"
          headerRows={
            <>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Account Balance</th>
              </tr>
            </>
          }
          contentRows={
            <>
              {clientsWhoOwe.map((client) => {
                return (
                  <tr key={client.clientId}>
                    <td>
                      <Link to={`/clients/${client.clientId}`}>
                        {client.clientId}
                      </Link>
                    </td>
                    <td>{client.fullName}</td>
                    <td>{formatPhone(client.primaryPhone)}</td>
                    <td>{maybeRedacted(client.redacted, client.balance)}</td>
                  </tr>
                );
              })}
            </>
          }
        />
      </div>
    </div>
  );

  function maybeRedacted(isRedacted, num) {
    if (isRedacted) {
      return `(Redacted)`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  }
}
