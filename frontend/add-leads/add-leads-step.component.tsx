import React, { useReducer } from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";
import AddLeadsTable from "./add-leads-table.component";

let uniqueId = 0;

export default function AddLeadsStep(props: AddLeadsStepProps) {
  const scope = useCss(css);
  useFullWidth();

  const [state, dispatch] = useReducer(
    (state, action) => {
      let leads;
      switch (action.type) {
        case "updateLead":
          leads = [...state.leads];
          leads[action.index] = {
            ...leads[action.index],
            [action.field]: action.value
          };
          if (action.index === leads.length - 1) {
            leads.push({ uuid: ++uniqueId });
          }
          return {
            ...state,
            leads
          };
        case "deleteLead":
          leads = [...state.leads];
          leads.splice(action.index, 1);
          return {
            ...state,
            leads
          };
      }
    },
    { leads: [{ uuid: uniqueId }] }
  );

  return (
    <div {...scope}>
      <AddLeadsTable
        leads={state.leads}
        deleteLead={index => dispatch({ type: "deleteLead", index })}
        updateLead={(index, field, value) =>
          dispatch({ type: "updateLead", index, field, value })
        }
      />
    </div>
  );
}

type AddLeadsStepProps = {
  path: string;
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
`;
