import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ClientsTableToolbar from "./toolbar/clients-table-toolbar.component";
import ClientsTable from "./table/clients-table.component";
import easyFetch from "../util/easy-fetch";
import { useQueryParamState } from "../util/use-query-param-state.hook";

const pageSize = 100;

export default function ClientList(props: ClientListProps) {
  useFullWidth();
  const [page, setPage] = useQueryParamState("page", "1", Number);
  const [clientApiData, setClientApiData] = React.useState<ClientApiData>({
    numClients: 0,
    clients: []
  });
  const [fetchingClients, setFetchingClients] = React.useState(true);

  React.useEffect(() => {
    if (fetchingClients) {
      // wait for data first
      return;
    }

    const lastPage = Math.ceil(clientApiData.numClients / pageSize);

    if (typeof page !== "number" || isNaN(page)) {
      setPage(1);
    } else if (page <= 0) {
      setPage(1);
    } else if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, clientApiData, fetchingClients]);

  React.useEffect(() => {
    if (fetchingClients) {
      new Promise<ClientApiData>(resolve => {
        setTimeout(() => {
          resolve(getDummyClientData(page));
        }, 300);
      })
        .then(data => {
          setClientApiData(data);
        })
        .finally(() => {
          setFetchingClients(false);
        });
      // const abortController = new AbortController()
      // easyFetch(`/api/clients?${constructQueryString()}`)
      // .then(data => {
      //   setClientApiData(data)
      // })

      // return () => abortController.abort()
    }
  }, [fetchingClients, page]);

  return (
    <>
      <PageHeader title="Client list" fullScreen={true} />
      <ClientsTableToolbar
        numClients={clientApiData.numClients}
        page={page}
        pageSize={pageSize}
        setPage={newPage}
      />
      <ClientsTable
        clients={clientApiData.clients}
        fetchingClients={fetchingClients}
        page={page}
      />
    </>
  );

  function newPage(page: number) {
    setPage(page);
    setFetchingClients(true);
  }

  function constructQueryString() {
    return "";
  }
}

const dummyClient = {
  id: 2,
  firstName: "Mario",
  lastName: "Luigi",
  fullName: "Mario Luigi",
  zip: "84107",
  birthday: "1981-01-01",
  phone: "5551111111",
  dateAdded: "2019-05-13",
  createdBy: {
    userId: 123,
    fullName: "Shigeru Miyamoto"
  }
};

function getDummyClientData(page: number): ClientApiData {
  const numClients = 211;
  const lastPage = 3;

  let clients = Array(page === lastPage ? 11 : pageSize);
  clients.fill(dummyClient);
  clients = clients.map((client, index) => ({
    ...client,
    id: index + 1 + (page - 1) * 100
  }));

  return {
    numClients,
    clients
  };
}

type ClientListProps = {
  path: string;
};

type ClientApiData = {
  numClients: number;
  clients: ClientListClient[];
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
