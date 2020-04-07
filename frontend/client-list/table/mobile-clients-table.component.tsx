import React from "react";
import { ClientsTableProps } from "./clients-table.component";
import { formatPhone } from "../../util/formatters";
import dayjs from "dayjs";
import dateformat from "dateformat";
import { Link } from "@reach/router";
import { useCss } from "kremling";

export default function MobileClientsTable(props: ClientsTableProps) {
  const scope = useCss(css);

  return (
    <div {...scope} className="mobile-clients-tables">
      {props.clients.map((client) => (
        <Link
          to={`/clients/${client.id}`}
          className="unstyled client-link"
          key={client.id}
        >
          <div className="card table-container">
            <table className="client-table">
              <tbody>
                <tr>
                  <td>ID:</td>
                  <td>{client.id}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>{client.fullName || ""}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>{formatPhone(client.phone) || ""}</td>
                </tr>
                <tr>
                  <td>ZIP:</td>
                  <td>{client.zip || ""}</td>
                </tr>
                <tr>
                  <td>Birthday:</td>
                  <td>{dayjs(client.birthday).format("M/D/YYYY")}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{client.email || "(No email)"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Link>
      ))}
      {props.fetchingClients && <div className="loading-overlay" />}
    </div>
  );
}

const css = `
& .client-link {
  display: block;
  margin-top: 3.2rem;
}

& .mobile-clients-tables {
  position: relative;
}

& .table-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

& .client-table td:first-child {
  text-align: right;
  padding-right: 2.4rem;
  width: 50%;
  max-width: 50%;
}

& .client-table td {
  padding: .4rem;
}

& .loading-overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--light-gray);
  z-index: 100;
  opacity: 0.6;
}
`;
