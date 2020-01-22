import React from "react";
import { LeadListLead, SelectedLeads } from "../lead-list.component";
import DesktopLeadsTable from "./desktop-leads-table.component";

export default function LeadsTable(props: LeadsTableProps) {
  return <DesktopLeadsTable {...props} />;
}

export type LeadsTableProps = {
  leads: LeadListLead[];
  fetchingLeads: boolean;
  page: number;
  selectedLeads: SelectedLeads;
  setSelectedLeads: (selectedLeads: SelectedLeads) => any;
};
