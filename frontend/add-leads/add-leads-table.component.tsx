import React from "react";
import AddLeadRow from "./add-lead-row.component";
import { useCss } from "kremling";

export default function AddLeadsTable({
  leads,
  deleteLead,
  updateLead
}: AddLeadsTableProps) {
  const scope = useCss(css);

  return (
    <table style={{ width: "100%" }} {...scope}>
      <thead>
        <tr>
          <th style={{ width: "18%" }}>First</th>
          <th style={{ width: "18%" }}>Last</th>
          <th style={{ width: "12%" }}>Phone</th>
          <th style={{ width: "8%" }}>Zip</th>
          <th style={{ width: "5%" }}>Age</th>
          <th style={{ width: "10%" }}>Gender</th>
          <th style={{ width: "5%" }}>Texts?</th>
          <th style={{ width: "20%" }}>Interests</th>
          <th style={{ width: "4%" }}></th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead, i) => (
          <AddLeadRow
            key={lead.uuid}
            lead={lead}
            updateLead={(field, value) => updateLead(i, field, value)}
            deleteLead={() => deleteLead(i)}
            canDelete={leads.length > 1}
          />
        ))}
      </tbody>
    </table>
  );
}

type AddLeadsTableProps = {
  leads: any[];
  deleteLead(index: number): any;
  updateLead(index: number, field: string, value: string): any;
};

const css = `
  & table {
    border-spacing: 0;
    table-layout: fixed;
  }
  & table td, & table th {
    border-collapse: collapse;
    padding: 0;
  }

  & tr select {
    -webkit-appearance: none;
    font-size: 1.8rem;
    padding: .4rem .6rem;
    border-radius: 0;
  }

  & tr input, & tr select {
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgb(238, 238, 238, 0.75);
  }

  & tr:focus-within input, & tr:hover input, & tr:focus-within select, & tr:hover select {
    background: white;
    border: 1px solid var(--very-light-gray);
  }
`;
