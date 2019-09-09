import React from "react";
import { useIsMobile } from "../../util/use-is-mobile.hook";
import MobileClientsTable from "./mobile-clients-table.component";
import DesktopClientsTable from "./desktop-clients-table.component";
import {
  ClientListClient,
  SortField,
  SortOrder
} from "../client-list.component";

export default function ClientsTable(props: ClientsTableProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileClientsTable {...props} />
  ) : (
    <DesktopClientsTable {...props} />
  );
}

export type ClientsTableProps = {
  clients: ClientListClient[];
  fetchingClients: boolean;
  page: number;
  newSortOrder: (sortField: SortField, sortOrder: SortOrder) => any;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedClients: object;
  setSelectedClients: (client: object) => any;
};
