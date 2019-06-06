import React from "react";
import { useCss } from "kremling";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import ClientSearchInput from "../../client-search/client-search-input.component";
import { SearchParseValues } from "../../client-search/client-search-dsl.helpers";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";

export default function ClientsTableToolbar(props: ClientsTableToolbarProps) {
  const scope = useCss(css);

  const lastPage = Math.ceil(props.numClients / props.pageSize);

  return (
    <div className="desktop-table-toolbar" {...scope}>
      <div className="left">
        <ClientSearchInput
          autoFocus
          performSearch={performSearch}
          initialValueFromQueryParams
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
  z-index: 100;
}

${mediaDesktop} {
  & .desktop-table-toolbar {
    flex-direction: row;
    height: 6rem;
  }

  & .left {
    width: 60%;
  }
}

${mediaMobile} {
  & .desktop-table-toolbar {
    flex-direction: column;
    justify-content: center;
    padding: .8rem;
  }
}

& .desktop-table-toolbar > * {
  display: flex;
  align-items: center;
}
`;

type ClientsTableToolbarProps = {
  numClients: number;
  page: number;
  pageSize: number;
  setPage(pageNum: number): void;
  setSearch(searchParse: SearchParseValues): any;
  fetchingClient: boolean;
};
