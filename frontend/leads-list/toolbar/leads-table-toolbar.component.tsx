import React from "react";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";
import { SearchParseValues } from "../../util/list-search/search-dsl.helpers";
import { SelectedLeads } from "../lead-list.component";
import LeadSearchInput from "./lead-search-input.component";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import DropDownMenuModal from "../../util/dropdown-menu-modal.component";
import Modal from "../../util/modal.component";
import DeleteBulkLeadsModal from "./delete-bulk-leads-modal.component";
import BulkSmsModal from "../../bulk-sms/bulk-sms-modal.component";

const BulkActionModals = {
  bulkDelete: DeleteBulkLeadsModal,
  noLeads: NoLeads,
  bulkSms: BulkSmsModal
};

export default function LeadsTableToolbar(props: LeadsTableToolbarProps) {
  const scope = useCss(css);
  const advancedSearchRef = React.useRef(null);
  const [modal, setModal] = React.useState<null | string>(null);

  const lastPage = Math.ceil(props.numLeads / props.pageSize);

  const Modal = modal && BulkActionModals[modal];

  return (
    <div className="leads-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <DropDownMenuModal>
            <li onClick={() => openModal("bulkSms")}>Bulk text (SMS)</li>
            <li onClick={() => openModal("bulkDelete")}>Delete leads</li>
          </DropDownMenuModal>
          {Modal && (
            <Modal close={closeModal} selectedLeads={props.selectedLeads} />
          )}
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

  function closeModal(shouldRefetch?: boolean) {
    setModal(null);
    if (shouldRefetch) {
      props.refetchLeads();
    }
  }

  function openModal(name) {
    if (Object.keys(props.selectedLeads).length === 0 && name !== "bulkSms") {
      setModal("noLeads");
    } else {
      setModal(name);
    }
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
  programData: any;
  events: Array<any>;
};

function NoLeads(props) {
  return (
    <Modal
      close={props.close}
      headerText="Select leads"
      primaryAction={props.close}
      primaryText="Close"
    >
      <p>You must select one or more leads before taking this action.</p>
    </Modal>
  );
}
