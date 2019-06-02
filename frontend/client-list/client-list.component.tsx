import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ClientsTableToolbar from "./toolbar/clients-table-toolbar.component";
import ClientsTable from "./table/clients-table.component";
import easyFetch from "../util/easy-fetch";
import { useQueryParamState } from "../util/use-query-param-state.hook";

export default function ClientList(props: ClientListProps) {
  useFullWidth();
  const [page, setPage] = useQueryParamState("page", "1", Number);
  const [clientApiData, setClientApiData] = React.useState<ClientApiData>({
    pagination: {
      currentPage: 0,
      numPages: 0,
      numClients: 0,
      pageSize: 0
    },
    clients: []
  });
  const [fetchingClients, setFetchingClients] = React.useState<Number>(null);

  React.useEffect(() => {
    if (fetchingClients) {
      // wait for data first
      return;
    }

    const lastPage = Math.ceil(
      clientApiData.pagination.numClients / clientApiData.pagination.pageSize
    );

    if (typeof page !== "number" || isNaN(page) || isNaN(lastPage)) {
      setPage(1);
    } else if (page <= 0) {
      setPage(1);
    } else if (lastPage === 0) {
      setPage(1);
    } else if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, clientApiData, fetchingClients]);

  React.useEffect(() => {
    if (fetchingClients !== page) {
      const abortController = new AbortController();
      easyFetch(`/api/clients?${constructQueryString()}`).then(data => {
        setFetchingClients(page);
        setClientApiData(data);
      });

      return () => abortController.abort();
    }
  }, [fetchingClients, page]);

  return (
    <>
      <PageHeader title="Client list" fullScreen={true} />
      <ClientsTableToolbar
        numClients={clientApiData.pagination.numClients}
        page={page}
        pageSize={clientApiData.pagination.pageSize}
        setPage={newPage}
      />
      <ClientsTable
        clients={clientApiData.clients}
        fetchingClients={fetchingClients !== page}
        page={page}
      />
    </>
  );

  function newPage(page: number) {
    setPage(page);
  }

  function constructQueryString() {
    return `page=${page}`;
  }
}

type ClientListProps = {
  path: string;
};

type ClientApiData = {
  clients: ClientListClient[];
  pagination: {
    numClients: number;
    currentPage: number;
    pageSize: number;
    numPages: number;
  };
};

export type ClientListClient = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  zip: string;
  birthday: string;
  phone: string;
  dateAdded: string;
  createdBy: {
    userId: number;
    fullName: string;
  };
};
