import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ClientsTableToolbar from "./toolbar/clients-table-toolbar.component";
import ClientsTable from "./table/clients-table.component";
import easyFetch from "../util/easy-fetch";
import { SingleClient } from "../view-edit-client/view-client.component";
import { useQueryParamState } from "../util/use-query-param-state.hook";

const pageSize = 100;

export default function ClientList(props: ClientListProps) {
  useFullWidth();
  const [clientApiData, setClientApiData] = React.useState<ClientApiData>({
    numClients: 150,
    clients: []
  });
  const [fetchingClients, setFetchingClients] = React.useState(true);
  const [page, setPage] = useQueryParamState("page", "1", Number);

  React.useEffect(() => {
    const lastPage = Math.ceil(clientApiData.numClients / pageSize);

    if (typeof page !== "number" || isNaN(page)) {
      setPage(1);
    } else if (page <= 0) {
      setPage(1);
    } else if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, clientApiData]);

  // React.useEffect(() => {
  //   if (fetchingClients) {
  //     const abortController = new AbortController()
  //     easyFetch(`/api/clients?${constructQueryString()}`)
  //     .then(data => {
  //       setClientApiData(data)
  //     })

  //     return () => abortController.abort()
  //   }
  // }, [fetchingClients])

  return (
    <>
      <PageHeader title="Client list" fullScreen={true} />
      <ClientsTableToolbar
        numClients={clientApiData.numClients}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
      />
      <ClientsTable />
    </>
  );

  function constructQueryString() {
    return "";
  }
}

type ClientListProps = {
  path: string;
};

type ClientApiData = {
  numClients: number;
  clients: SingleClient[];
};
