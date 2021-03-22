import { useEffect } from "react";
import easyFetch from "../../util/easy-fetch";
import { SelectedClients } from "../client-list.component";
import queryString from "query-string";
import { flatten } from "lodash-es";
import { handlePromiseError } from "../../util/error-helpers";
import { exportToCsv } from "../../util/csv-utils";

export default function ExportClientListCsv(props: ExportClientListCsvProps) {
  useEffect(() => {
    const ac = new AbortController();

    const fetchPromises = [];

    const queryParams = queryString.parse(window.location.search);

    for (let i = 1; i <= props.lastPage; i++) {
      queryParams.page = String(i);
      fetchPromises.push(
        easyFetch(`/api/clients?${queryString.stringify(queryParams)}`, {
          signal: ac.signal,
        })
      );
    }

    Promise.all(fetchPromises).then((clientResults) => {
      const allClients = flatten(clientResults.map((r) => r.clients));
      exportToCsv({
        data: allClients,
        columnNames: [
          "id",
          "fullName",
          "phone",
          "address",
          "city",
          "state",
          "zip",
        ],
        fileName: "client_list.csv",
      });

      props.close();
    }, handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  return null;
}

type ExportClientListCsvProps = {
  lastPage: number;
  close: (shouldRefetch?: boolean) => any;
  selectedClients: SelectedClients;
};
