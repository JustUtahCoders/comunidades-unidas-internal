import React from "react";
import { useCss } from "kremling";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import kabobIcon from "../../../icons/148705-essential-collection/svg/more-1.svg";
import ClientSearchInput from "../../client-search/client-list/client-search-input.component";
import { SearchParseValues } from "../../client-search/client-list/client-search-dsl.helpers";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";

export default function ClientsTableToolbar(props: ClientsTableToolbarProps) {
  const [bulkActionMenuIsOpen, setBulkActionMenuIsOpen] = React.useState(false);

  const scope = useCss(css);
  const advancedSearchRef = React.useRef(null);

  const lastPage = Math.ceil(props.numClients / props.pageSize);

  return (
    <div className="clients-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <div className="bulk-action-container">
            <img
              alt="kabob icon"
              className="bulk-action-icon"
              onClick={() => setBulkActionMenuIsOpen(!bulkActionMenuIsOpen)}
              src={kabobIcon}
            />
            {bulkActionMenuIsOpen === true ? (
              <div
                className="bulk-action-menu-modal"
                onClick={() => setBulkActionMenuIsOpen(!bulkActionMenuIsOpen)}
              >
                <div className="bulk-action-menu-dropdown">
                  <button>Delete Selected Clients</button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <ClientSearchInput
            autoFocus
            performSearch={performSearch}
            initialValueFromQueryParams
            disabled={props.fetchingClient}
            advancedSearchRef={advancedSearchRef}
          />
        </div>
        {lastPage !== 0 && (
          <div>
            <div>
              {(props.page - 1) * props.pageSize + 1} -{" "}
              {Math.min(props.page * props.pageSize, props.numClients)} of{" "}
              {props.numClients.toLocaleString()}
            </div>
            <button
              className="icon"
              onClick={goBack}
              disabled={props.page === 1}
            >
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
      <div ref={advancedSearchRef} />
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
& .clients-table-toolbar {
  background-color: white;
  position: sticky;
  top: 0;
  left: 23.6rem;
  padding: 0 1.4rem;
  width: 100%;
  z-index: 100;
}

& .desktop-table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

& .bulk-action-icon {
  height: 2rem;
  margin: 0 1rem 0 -0.5rem;
}

& .bulk-action-menu-modal {
  position: absolute;
  top: 9vh;
  left: 0;
  display: flex;
  height: 78.5vh;
  width: 82.5vw;
  justify-contents: flex-start;
  align-items: flex-start;
}

& .bulk-action-menu-dropdown {
  padding: 1rem 2rem 1rem 2rem;
  background-color: var(--very-light-gray);
  box-shadow: 0 .2rem .2rem var(--medium-gray), 
              0 .3rem .6rem var(--very-dark-gray);
  display: flex;
  flex-direction: column;
  justify-contents: space-between;
  align-items: flex-start;
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
  selectedClients: object;
  setSelectedClients: (client: object) => any;
  setModalIsOpen: any;
};
