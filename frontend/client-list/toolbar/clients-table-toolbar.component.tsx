import React from "react";
import { useIsMobile } from "../../util/use-is-mobile.hook";
import MobileClientsTableToolbar from "./mobile-clients-table-toolbar.component";
import DesktopTableToolbar from "./desktop-table-toolbar-component";
import { SearchParseValues } from "../../client-search/client-search-dsl.helpers";

export default function ClientsTableToolbar(props: ClientsTableToolbarProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileClientsTableToolbar {...props} />
  ) : (
    <DesktopTableToolbar {...props} />
  );
}

export type ClientsTableToolbarProps = {
  numClients: number;
  page: number;
  pageSize: number;
  setPage(pageNum: number): void;
  setSearch(searchParse: SearchParseValues): any;
  fetchingClient: boolean;
};
