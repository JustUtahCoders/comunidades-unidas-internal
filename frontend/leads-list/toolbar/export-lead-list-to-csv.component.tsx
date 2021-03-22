import { useEffect } from "react";
import easyFetch from "../../util/easy-fetch";
import queryString from "query-string";
import { flatten } from "lodash-es";
import { handlePromiseError } from "../../util/error-helpers";
import { exportToCsv } from "../../util/csv-utils";
import { SelectedLeads } from "../lead-list.component";

export default function ExportLeadListCsv(props: ExportLeadListCsvProps) {
  useEffect(() => {
    const ac = new AbortController();

    const fetchPromises = [];

    const queryParams = queryString.parse(window.location.search);

    for (let i = 1; i <= props.lastPage; i++) {
      queryParams.page = String(i);
      fetchPromises.push(
        easyFetch(`/api/leads?${queryString.stringify(queryParams)}`, {
          signal: ac.signal,
        })
      );
    }

    Promise.all(fetchPromises).then((leadResults) => {
      const allLeads = flatten(leadResults.map((r) => r.leads));
      exportToCsv({
        data: allLeads,
        columnNames: [
          "id",
          "fullName",
          "phone",
          "leadStatus",
          "dateOfSignUp",
          "smsConsent",
        ],
        fileName: "lead_list.csv",
      });

      props.close();
    }, handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  return null;
}

type ExportLeadListCsvProps = {
  lastPage: number;
  close: (shouldRefetch?: boolean) => any;
  selectedClients: SelectedLeads;
};
