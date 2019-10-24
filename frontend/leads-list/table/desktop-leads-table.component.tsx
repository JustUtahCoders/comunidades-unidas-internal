import React from "react";
import { LeadsTableProps } from "./leads-table.component";
import { useCss } from "kremling";

export default function DesktopLeadsTable(props: LeadsTableProps) {
  const scope = useCss(css);

  return (
    <div className="table-container" {...scope}>
      <table className="leads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Zip</th>
            <th>Phone</th>
            <th>SMS Consent</th>
            <th>Status</th>
            <th>Interests</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

const css = ``;
