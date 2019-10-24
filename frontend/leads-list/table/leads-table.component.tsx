import React from "react";
import { LeadListLead } from "../lead-list.component";
import DesktopLeadsTable from "./desktop-leads-table.component";

export default function LeadsTable(props: LeadsTableProps) {
  return <DesktopLeadsTable {...props} />;
}

export type LeadsTableProps = {
  leads: LeadListLead[];
  fetchingLeads: boolean;
  page: number;
};
