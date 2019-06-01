import React from "react";
import { ClientsTableProps } from "./clients-table.component";
import { useCss } from "kremling";

export default function DesktopClientsTable(props: ClientsTableProps) {
  const scope = useCss(css);

  return (
    <table className="clients-table" {...scope}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Birthday</th>
        </tr>
      </thead>
      <tbody>
        {props.clients.map(client => (
          <tr>
            <td>{client.fullName}</td>
            <td>{client.birthday}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const css = `
& table.clients-table {
  width: 100%;
}

& .clients-table th {
  position: sticky;
  top: 6rem;
}

& .clients-table thead tr {
  height: 6rem;
}
`;
