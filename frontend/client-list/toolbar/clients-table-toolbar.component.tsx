import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import ClientSearchInput from "./client-search-input.component";
import { SearchParseValues } from "../../util/list-search/search-dsl.helpers";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";
import { SelectedClients, ClientListClient } from "../client-list.component";
import DropDownMenuModal from "../../util/dropdown-menu-modal.component";

export default function ClientsTableToolbar(props: ClientsTableToolbarProps) {
  const scope = useCss(css);
  const advancedSearchRef = React.useRef(null);
  const [bulkActionMenuIsOpen, setBulkActionMenuIsOpen] = React.useState(false);

  const lastPage = Math.ceil(props.numClients / props.pageSize);

  return (
    <div className="clients-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <DropDownMenuModal
            buttonData={[
              {
                buttonText: "Delete Client(s)",
                buttonAction: () => openModal("deleting")
              }
            ]}
          />
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

  function openModal(option) {
    if (Object.keys(props.selectedClients).length === 0) {
      props.setModalOptions({
        isOpen: true,
        headerText: "No Clients Selected",
        primaryText: "Okay",
        primaryAction: () =>
          props.setModalOptions({
            isOpen: false,
            headerText: null,
            primaryText: null,
            primaryAction: null,
            secondaryText: null,
            secondaryAction: null,
            children: null
          }),
        children: (
          <p>
            You must select a client from the list before this action can be
            taken.
          </p>
        )
      });
    } else {
      if (option === "deleting") {
        const clientsToDelete = Object.values(
          props.selectedClients
        ) as ClientListClient[];
        const mapSelectedClients = clientsToDelete.map(client => {
          return (
            <li key={client.id}>
              #{client.id} - {client.fullName}
            </li>
          );
        });
        props.setModalOptions({
          isOpen: true,
          headerText: "Delete Selected Client(s)",
          primaryText: "No",
          primaryAction: () =>
            props.setModalOptions({
              isOpen: false,
              headerText: null,
              primaryText: null,
              primaryAction: null,
              secondaryText: null,
              secondaryAction: null,
              children: null
            }),
          secondaryText: "Yes",
          secondaryAction: () => deleteSelectedClients(),
          children: (
            <>
              <p>
                Are you sure you want to delete the following selected
                client(s)?
              </p>
              <ul>{mapSelectedClients}</ul>
            </>
          )
        });
      }
    }
  }

  function deleteSelectedClients() {
    const clientsToDelete = Object.values(props.selectedClients);
    Promise.all(
      clientsToDelete.map(client => {
        return easyFetch(`/api/clients/${client.id}`, {
          method: "DELETE"
        });
      })
    )
      .then(function() {
        () =>
          props.setModalOptions({
            isOpen: false,
            headerText: null,
            primaryText: null,
            primaryAction: null,
            secondaryText: null,
            secondaryAction: null,
            children: null
          });
        props.setModalOptions({});
        props.setSelectedClients([]);
        props.refetchClients();
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
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
  top: 100%;
  left: 0;
  display: flex;
  height: 78.5vh;
  width: 82.5vw;
  justify-contents: flex-start;
  align-items: flex-start;
}

& .popup.bulk-action-menu-dropdown {
  margin: 0;
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
  selectedClients: SelectedClients;
  setSelectedClients: (selectedClients: SelectedClients) => any;
  modalOptions: object;
  setModalOptions: (modalOptions: object) => any;
  refetchClients: () => any;
};
