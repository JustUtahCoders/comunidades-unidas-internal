import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";
import { SearchParseValues } from "../../util/list-search/search-dsl.helpers";
import { LeadListLead, SelectedLeads } from "../lead-list.component";
import LeadSearchInput from "./lead-search-input.component";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import DropDownMenuModal from "../../util/dropdown-menu-modal.component";

export default function LeadsTableToolbar(props: LeadsTableToolbarProps) {
  const scope = useCss(css);
  const advancedSearchRef = React.useRef(null);
  const [bulkActionMenuIsOpen, setBulkActionMenuIsOpen] = React.useState(false);

  const lastPage = Math.ceil(props.numLeads / props.pageSize);

  return (
    <div className="leads-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <DropDownMenuModal
            buttonData={[
              {
                buttonText: "Delete Lead(s)",
                buttonAction: () => openModal("deleting")
              }
            ]}
          />
          <LeadSearchInput
            autoFocus
            performSearch={performSearch}
            initialValueFromQueryParams
            disabled={props.fetchingLead}
            advancedSearchRef={advancedSearchRef}
            programData={props.programData}
            events={props.events}
          />
        </div>
        {lastPage !== 0 && (
          <div className="pagination-container">
            <div>
              {(props.page - 1) * props.pageSize + 1} -{" "}
              {Math.min(props.page * props.pageSize, props.numLeads)} of{" "}
              {props.numLeads.toLocaleString()}
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
    if (Object.keys(props.selectedLeads).length === 0) {
      props.setModalOptions({
        isOpen: true,
        headerText: "No Leads Selected",
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
            You must select a lead from the list before this action can be
            taken.
          </p>
        )
      });
    } else {
      if (option === "deleting") {
        const leadsToDelete = Object.values(
          props.selectedLeads
        ) as LeadListLead[];
        const mapSelectedLeads = leadsToDelete.map(lead => {
          return (
            <li key={lead.id}>
              #{lead.id} - {lead.fullName}
            </li>
          );
        });
        props.setModalOptions({
          isOpen: true,
          headerText: "Delete Selected Lead(s)",
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
          secondaryAction: () => deleteSelectedLeads(),
          children: (
            <>
              <p>
                Are you sure you want to delete the following selected lead(s)?
              </p>
              <ul>{mapSelectedLeads}</ul>
            </>
          )
        });
      }
    }
  }

  function deleteSelectedLeads() {
    const leadsToDelete = Object.values(props.selectedLeads);
    Promise.all(
      leadsToDelete.map(lead => {
        return easyFetch(`/api/leads/${lead.id}`, {
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
        props.setSelectedLeads([]);
        props.refetchLeads();
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
  }
}

const css = `
  & .leads-table-toolbar {
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

  & .pagination-container {
    position: absolute;
    right: 0;
  }
`;

type LeadsTableToolbarProps = {
  numLeads: number;
  page: number;
  pageSize: number;
  setPage(pageNum: number): void;
  setSearch(searchParse: SearchParseValues): any;
  fetchingLead: boolean;
  refetchLeads: () => any;
  selectedLeads: SelectedLeads;
  setSelectedLeads: (selectedLeads: SelectedLeads) => any;
  modalOptions: object;
  setModalOptions: (modalOptions: object) => any;
  programData: any;
  events: Array<any>;
};
