import React from "react";
import { ClientsTableProps } from "./clients-table.component";
import { useCss } from "kremling";
import { Link } from "@reach/router";
import { formatPhone } from "../../util/formatters";
import dateformat from "dateformat";
import targetImg from "../../../icons/148705-essential-collection/svg/target.svg";

export default function DesktopClientsTable(props: ClientsTableProps) {
  const scope = useCss(css);
  const [selectAll, setSelectAll] = React.useState(false);

  React.useEffect(() => {
    const checkboxEls = document.querySelectorAll(
      `input[type="checkbox"][name="client-checked"]`
    );
    for (let i = 0; i < checkboxEls.length; i++) {
      // @ts-ignore
      checkboxEls[i].checked = selectAll;
    }
  }, [selectAll, props.clients]);

  return (
    <div className="table-container" {...scope}>
      <table className="clients-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={evt => setSelectAll(evt.target.checked)}
                name="select-all"
                aria-label="Select all clients"
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Phone</th>
            <th>ZIP</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody
          role="group"
          aria-label="Select one or more clients for batch actions"
        >
          {props.clients.length === 0 && !props.fetchingClients && (
            <tr className="empty-state">
              <td colSpan={7}>
                <div>
                  <img src={targetImg} alt="No clients" title="No clients" />
                  <div>No clients match the search criteria</div>
                </div>
              </td>
            </tr>
          )}
          {props.clients.map(client => (
            <tr key={client.id}>
              <td onClick={checkTdClicked}>
                <input
                  type="checkbox"
                  name="client-checked"
                  aria-label={`Select ${client.fullName}`}
                  value={client.id}
                  onClick={evt => evt.stopPropagation()}
                />
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {client.id}
                </Link>
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {client.fullName}
                </Link>
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {dateformat(client.birthday, "m/d/yyyy")}
                </Link>
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {formatPhone(client.phone)}
                </Link>
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {client.zip}
                </Link>
              </td>
              <td>
                <Link to={`/clients/${client.id}`} className="unstyled">
                  {client.createdBy.fullName} on{" "}
                  {dateformat(client.createdBy.timestamp, "m/d/yyyy")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.fetchingClients && props.clients.length > 0 && (
        <div className="loading-overlay" />
      )}
    </div>
  );

  function checkTdClicked(evt) {
    const checkboxEl = evt.target.querySelector('input[type="checkbox"]');
    checkboxEl.checked = !checkboxEl.checked;
  }
}

const css = `
& .table-container {
  position: relative;
}

& table.clients-table {
  width: 100%;
  height: 100%;
  border-spacing: 0;
}

& .clients-table th {
  position: sticky;
  top: 6rem;
  background-color: var(--very-light-gray);
  box-shadow: 0 .2rem .2rem var(--medium-gray);
}

& .clients-table thead {
  z-index: 100;
}

& .clients-table thead tr {
  height: 6rem;
}

& .clients-table tbody tr:hover td {
  background-color: var(--very-light-gray);
}

& .clients-table tbody {
  background-color: white;
}

& .clients-table td {
  text-align: center;
  height: 4rem;
  border-bottom: .1rem solid var(--very-light-gray);
}

& .clients-table td a {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

& .loading-overlay {
  position: absolute;
  top: 6rem;
  left: 0;
  width: 100%;
  height: calc(100% - 6rem);
  z-index: 10;
  background-color: var(--light-gray);
  opacity: 0.7;
}

& .empty-state img {
  width: 10rem;
  padding: 1rem;
}

& .empty-state > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15rem;
}

& .empty-state td {
  padding: 1.6rem;
}

& .clients-table tbody tr.empty-state:hover td {
  background-color: white;
}
`;
