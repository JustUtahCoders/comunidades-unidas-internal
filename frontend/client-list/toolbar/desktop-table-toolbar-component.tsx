import React from "react";
import { ClientsTableToolbarProps } from "./clients-table-toolbar.component";
import { useCss } from "kremling";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import ClientSearchInput from "../../client-search/client-search-input.component";
import { SearchParseValues } from "../../client-search/client-search-dsl.helpers";

export default function DesktopTableToolbar(props: ClientsTableToolbarProps) {
  const scope = useCss(css);

  const lastPage = Math.ceil(props.numClients / props.pageSize);

  return (
    <div className="desktop-table-toolbar" {...scope}>
      <div className="left">
        <ClientSearchInput
          autoFocus
          performSearch={performSearch}
          disabled={props.fetchingClient}
        />
      </div>
      {lastPage !== 0 && (
        <div>
          <div>
            {(props.page - 1) * props.pageSize + 1} -{" "}
            {Math.min(props.page * props.pageSize, props.numClients)} of{" "}
            {props.numClients.toLocaleString()}
          </div>
          <button className="icon" onClick={goBack} disabled={props.page === 1}>
            <img
              src={backIcon}
              alt="Go back one page"
              title="Go back one page"
            />
          </button>
          <button
            className="icon"
            onClick={goForward}
            disabled={props.page === lastPage}
          >
            <img
              src={nextIcon}
              alt="Go forward one page"
              title="Go forward one page"
            />
          </button>
        </div>
      )}
    </div>
  );

  function goBack() {
    props.setPage(props.page - 1);
  }

  function goForward() {
    props.setPage(props.page + 1);
  }

  function performSearch(searchParse: SearchParseValues) {
    props.setSearch(searchParse);
  }
}

const css = `
& .desktop-table-toolbar {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.4rem;
  position: sticky;
  top: 0;
  left: 23.6rem;
  width: 100%;
  height: 6rem;
  z-index: 100;
}

& .desktop-table-toolbar > * {
  display: flex;
  align-items: center;
}

& .left {
  width: 60%;
}
`;
