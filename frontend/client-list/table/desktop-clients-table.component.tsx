import React from "react";
import { ClientsTableProps } from "./clients-table.component";
import { useCss } from "kremling";
import { Link } from "@reach/router";
import { formatPhone } from "../../util/formatters";
import dateformat from "dateformat";

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
        <tbody>
          {props.clients.map(client => (
            <tr key={client.id}>
              <td onClick={checkTdClicked}>
                <input
                  type="checkbox"
                  name="client-checked"
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
                  {client.birthday}
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
                  {dateformat(client.dateAdded, "m/d/yyyy")}
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
`;
