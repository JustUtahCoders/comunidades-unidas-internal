import React from "react";
import Modal from "../util/modal.component";
import { CsvDataService } from "../util/export-to-csv.component";

// Hard-coded data in the format exportToCsv is expecting
const testData = [
  {
    firstName: "Celica",
    lastName: "McMichel",
    phone: "8012220394",
    address: "147 Main street, Salt Lake City, UT 32231",
  },
  {
    firstName: "John",
    lastName: "Paul",
    phone: "8290020302",
    address: "147 Main street, Salt Lake City, UT 32231",
  },
  {
    firstName: "Jack",
    lastName: "Johnson",
    phone: "9203929303",
    address: "147 Main street, Salt Lake City, UT 32231",
  },
];

export default function BulkExportModal(props: BulkExportModalProps) {
  const [clientsSelected, setClientsSelected] = React.useState(
    Object.keys(props.selectedClients).length
  );

  /*
  // This doesn't include the address the client is looking for
  // but I was passing it into CSVDataService.exportToCsv
  const [clients, setClients] = React.useState([props.selectedClients]);
  */

  return (
    <Modal
      close={props.close}
      headerText={headerText}
      primaryText={"Export"}
      primaryAction={() => {
        CsvDataService.exportToCsv("exported-clients.csv", testData);
      }}
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
