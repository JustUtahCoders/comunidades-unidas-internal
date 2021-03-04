import React from "react";
import Modal from "../util/modal.component";
import { CsvDataService } from "../util/export-to-csv.component";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";
import { useCss } from "kremling";
import queryString from "query-string";
import { startCase, entries } from "lodash-es";

export default function BulkExportModal(props: BulkExportModalProps) {
  const [clientsSelected, setClientsSelected] = React.useState(
    Object.keys(props.selectedClients).length
  );
  const [clients, setClients] = React.useState([props.selectedClients]);

  return (
    <Modal
      close={props.close}
      headerText={headerText}
      primaryText={"Export"}
      primaryAction={() =>
        CsvDataService.exportToCsv("exported-clients.csv", clients)
      }
      secondaryText={"Close"}
      secondaryAction={props.close}
    >
      <div>
        <p>
          You are able to download {clientsSelected}{" "}
          {clientsSelected === 1 ? "client" : "clients"} to CSV file with the
          following columns:
        </p>
        <ul>
          <li>name</li>
          <li>phone number</li>
          <li>address</li>
        </ul>
      </div>
    </Modal>
  );
}

type BulkExportModalProps = {
  selectedClients: Array<Object>;
  close(shouldRefetch?: boolean): any;
};

const headerText = "Export Data as CSV";
