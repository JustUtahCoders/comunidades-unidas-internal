import React from "react";
import { EventListEvent, SortField, SortOrder } from "./event-list.component";
import DesktopEventTable from "./desktop-event-table.component";

export default function EventTable(props: EventTableProps) {
  return <DesktopEventTable {...props} />;
}

export type EventTableProps = {
  events: EventListEvent[];
  fetchingEvents: boolean;
  page: number;
  newSortOrder: (sortField: SortField, sortOrder: SortOrder) => any;
  sortField: SortField;
  sortOrder: SortOrder;
};
