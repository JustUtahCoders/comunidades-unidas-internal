import React, { Dispatch, SetStateAction } from "react";
import { useCss } from "kremling";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import ClientSearchInput from "./client-search-input.component";
import { SearchParseValues } from "../../util/list-search/search-dsl.helpers";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";
import { SelectedClients } from "../client-list.component";
import DropDownMenuModal from "../../util/dropdown-menu-modal.component";
import DeleteBulkClientModal from "./delete-bulk-client-modal.component";
import Modal from "../../util/modal.component";
import BulkSmsModal from "../../bulk-sms/bulk-sms-modal.component";

const BulkActionModals = {
  bulkDelete: DeleteBulkClientModal,
  noClients: NoClients,
  bulkSms: BulkSmsModal
};

export default function ClientsTableToolbar(props: ClientsTableToolbarProps) {
  const scope = useCss(css);
  const advancedSearchRef = React.useRef(null);
  const [modal, setModal] = React.useState<null | string>(null);

  const lastPage = Math.ceil(props.numClients / props.pageSize);

  const Modal = modal && BulkActionModals[modal];

  return (
    <div className="clients-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <DropDownMenuModal>
            <li onClick={() => openModal("bulkSms")}>Bulk text (SMS)</li>
            <li onClick={() => openModal("bulkDelete")}>Delete clients</li>
          </DropDownMenuModal>
          {Modal && (
            <Modal close={closeModal} selectedClients={props.selectedClients} />
          )}
          <ClientSearchInput
            autoFocus
            performSearch={performSearch}
            initialValueFromQueryParams
            disabled={props.fetchingClient}
            advancedSearchRef={advancedSearchRef}
            advancedSearchOpen={props.advancedSearchOpen}
            setAdvancedSearchOpen={props.setAdvancedSearchOpen}
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

  function openModal(name) {
    if (Object.keys(props.selectedClients).length === 0 && name !== "bulkSms") {
      setModal("noClients");
    } else {
      setModal(name);
    }
  }

  function closeModal(shouldRefetch) {
    setModal(null);
    if (shouldRefetch) {
      props.refetchClients();
    }
  }
}

const css = `
@media print {
  & .clients-table-toolbar {
    display: none;
  }
}

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
  refetchClients: () => any;
  advancedSearchOpen: boolean;
  setAdvancedSearchOpen: Dispatch<SetStateAction<boolean>>;
};

function NoClients(props) {
  return (
    <Modal
      close={props.close}
      headerText="Select clients"
      primaryAction={props.close}
      primaryText="Close"
    >
      <p>You must select one or more clients before taking this action.</p>
    </Modal>
  );
}
