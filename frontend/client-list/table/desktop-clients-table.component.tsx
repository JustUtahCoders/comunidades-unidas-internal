import React from "react";
import { ClientsTableProps } from "./clients-table.component";

export default function DesktopClientsTable(props: ClientsTableProps) {
  return (
    <table style={{ height: "500rem" }}>
      <thead>
        <tr style={{ position: "sticky", top: "6rem" }}>
          <th>Name</th>
          <th>Birthday</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hello</td>
          <td>There</td>
        </tr>
      </tbody>
    </table>
  );
}
