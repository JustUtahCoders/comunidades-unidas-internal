import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ClientsTableToolbar from "./toolbar/clients-table-toolbar.component";
import ClientsTable from "./table/clients-table.component";
import easyFetch from "../util/easy-fetch";
import { SearchParseValues } from "../util/list-search/search-dsl.helpers";
import queryString from "query-string";
import Modal from "../util/modal.component";

export default function ClientList(props: ClientListProps) {
  const [modalOptions, setModalOptions] = React.useState({
    isOpen: false,
    headerText: null,
    primaryText: null,
    primaryAction: null,
    secondaryText: null,
    secondaryAction: null,
    children: null
  });
  const [selectedClients, setSelectedClients] = React.useState<SelectedClients>(
    {}
  );

  useFullWidth();
  const [apiState, dispatchApiState] = React.useReducer(
    reduceApiState,
    null,
    getInitialState
  );

  useAlwaysValidPage(apiState, dispatchApiState);
  useClientsApi(apiState, dispatchApiState);
  useFrontendUrlParams(apiState, dispatchApiState);

  const fetchingClient = apiState.status !== ApiStateStatus.fetched;

  return (
    <>
      <PageHeader title="Client list" fullScreen={true} />
      <ClientsTableToolbar
        numClients={apiState.apiData.pagination.numClients}
        page={apiState.page}
        pageSize={apiState.apiData.pagination.pageSize}
        setPage={newPage}
        setSearch={setSearch}
        fetchingClient={fetchingClient}
        selectedClients={selectedClients}
        setSelectedClients={setSelectedClients}
        modalOptions={modalOptions}
        setModalOptions={setModalOptions}
        refetchClients={refetchClients}
      />
      <ClientsTable
        clients={apiState.apiData.clients}
        fetchingClients={fetchingClient}
        page={apiState.page}
        newSortOrder={newSortOrder}
        sortField={apiState.sortField}
        sortOrder={apiState.sortOrder}
        selectedClients={selectedClients}
        setSelectedClients={setSelectedClients}
      />
      {modalOptions.isOpen === true && (
        <Modal
          close={() =>
            setModalOptions({
              isOpen: false,
              headerText: null,
              primaryText: null,
              primaryAction: null,
              secondaryText: null,
              secondaryAction: null,
              children: null
            })
          }
          headerText={modalOptions.headerText}
          primaryText={modalOptions.primaryText}
          primaryAction={modalOptions.primaryAction}
          secondaryText={modalOptions.secondaryText}
          secondaryAction={modalOptions.secondaryAction}
          children={modalOptions.children}
        />
      )}
    </>
  );

  function newPage(page: number) {
    dispatchApiState({
      type: ActionTypes.newPage,
      page
    });
  }

  function setSearch(search) {
    dispatchApiState({
      type: ActionTypes.newSearch,
      search
    });
  }

  function newSortOrder(sortField: SortField, sortOrder: SortOrder) {
    dispatchApiState({
      type: ActionTypes.newSort,
      sortField,
      sortOrder
    });
  }

  function refetchClients() {
    dispatchApiState({
      type: ActionTypes.shouldFetch
    });
  }
}

function reduceApiState(state: ApiState, action: ApiStateAction) {
  switch (action.type) {
    case ActionTypes.fetching:
      return {
        ...state,
        status: ApiStateStatus.fetching
      };
    case ActionTypes.fetched:
      return {
        ...state,
        status: ApiStateStatus.fetched,
        apiData: action.apiData
      };
    case ActionTypes.newPage:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        page: action.page
      };
    case ActionTypes.newSearch:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        search: action.search
      };
    case ActionTypes.newQueryParams:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch
      };
    case ActionTypes.apiError:
      return {
        ...state,
        status: ApiStateStatus.fetched
      };
    case ActionTypes.newSort:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        sortField: action.sortField,
        sortOrder: action.sortOrder,
        page: 1
      };
    case ActionTypes.shouldFetch:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch
      };
    default:
      throw Error();
  }
}

function useClientsApi(apiState, dispatchApiState) {
  React.useEffect(() => {
    if (apiState.status === ApiStateStatus.shouldFetch) {
      const abortController = new AbortController();
      const query = queryString.stringify({
        ...apiState.search,
        sortField: apiState.sortField,
        sortOrder: apiState.sortOrder,
        page: apiState.page
      });
      easyFetch(`/api/clients?${query}`)
        .then(data => {
          dispatchApiState({
            type: ActionTypes.fetched,
            apiData: data
          });
        })
        .catch(err => {
          dispatchApiState({
            type: ActionTypes.apiError,
            err
          });

          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [apiState]);
}

function useAlwaysValidPage(apiState, dispatchApiState) {
  React.useEffect(() => {
    if (apiState.status !== ApiStateStatus.fetched) {
      // wait for data first
      return;
    }

    const lastPage = Math.ceil(
      apiState.apiData.pagination.numClients /
        apiState.apiData.pagination.pageSize
    );

    let newPage;

    if (
      typeof apiState.page !== "number" ||
      isNaN(apiState.page) ||
      isNaN(lastPage)
    ) {
      newPage = 1;
    } else if (apiState.page <= 0) {
      newPage = 1;
    } else if (lastPage === 0) {
      newPage = 1;
    } else if (apiState.page > lastPage) {
      newPage = lastPage;
    }

    if (newPage && newPage !== apiState.page) {
      dispatchApiState({
        type: ActionTypes.newPage,
        page: newPage
      });
    }
  }, [apiState]);
}

function useFrontendUrlParams(apiState, dispatchApiState) {
  React.useEffect(() => {
    const params = queryString.parse(window.location.search);
    dispatchApiState({
      type: ActionTypes.newQueryParams,
      params
    });
  }, []);

  React.useEffect(() => {
    const queryParams = queryString.stringify({
      page: apiState.page,
      sortField: apiState.sortField,
      sortOrder: apiState.sortOrder,
      ...apiState.search
    });

    window.history.replaceState(
      window.history.state,
      document.title,
      window.location.pathname + "?" + queryParams
    );
  }, [apiState]);
}

export type SelectedClients = {
  [clientId: number]: ClientListClient;
};

type ApiState = {
  status: ApiStateStatus;
  apiData: ClientApiData;
  page: number;
  search: SearchParseValues;
  sortField: SortField;
  sortOrder: SortOrder;
};

export enum SortField {
  id = "id",
  firstName = "firstName",
  lastName = "lastName",
  birthday = "birthday"
}

export enum SortOrder {
  ascending = "asc",
  descending = "desc"
}

export function reversedSortOrder(oldOrder: SortOrder) {
  return oldOrder === SortOrder.ascending
    ? SortOrder.descending
    : SortOrder.ascending;
}

enum ApiStateStatus {
  uninitialized = "uninitialized",
  shouldFetch = "shouldFetch",
  fetching = "fetching",
  fetched = "fetched"
}

enum ActionTypes {
  newPage = "newPage",
  newSearch = "newSearch",
  newQueryParams = "newQueryParams",
  fetching = "fetching",
  fetched = "fetched",
  shouldFetch = "shouldFetch",
  apiError = "apiError",
  newSort = "newSort"
}

type ApiStateAction =
  | NewPageAction
  | NewSearchAction
  | NewParamsAction
  | FetchingAction
  | FetchedAction
  | NewSortAction
  | ShouldFetchAction
  | ApiErrorAction;

type ShouldFetchAction = {
  type: ActionTypes.shouldFetch;
};

type NewSortAction = {
  type: ActionTypes.newSort;
  sortField: SortField;
  sortOrder: SortOrder;
};

type NewPageAction = {
  type: ActionTypes.newPage;
  page: number;
};

type NewSearchAction = {
  type: ActionTypes.newSearch;
  search: SearchParseValues;
};

type NewParamsAction = {
  type: ActionTypes.newQueryParams;
  params: SearchParseValues & {
    page: number;
  };
};

type FetchingAction = {
  type: ActionTypes.fetching;
};

type FetchedAction = {
  type: ActionTypes.fetched;
  apiData: ClientApiData;
};

type ApiErrorAction = {
  type: ActionTypes.apiError;
  err: any;
};

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
  email: string;
  createdBy: {
    userId: number;
    fullName: string;
    timestamp: string;
  };
};

function getInitialState(): ApiState {
  const queryParams = queryString.parse(window.location.search);

  let page = null;

  if (!isNaN(Number(queryParams.page))) {
    page = Number(queryParams.page);
    if (page < 1) {
      page = 1;
    }
  }

  let sortField = queryParams.sortField as SortField;
  if (!SortField[sortField]) {
    sortField = SortField.lastName;
  }

  let sortOrder = queryParams.sortOrder as SortOrder;
  if (!Object.values(SortOrder).includes(sortOrder)) {
    sortOrder = SortOrder.ascending;
  }

  const search = { ...queryParams };
  delete search.page;
  delete search.sortField;
  delete search.sortOrder;

  return {
    status: ApiStateStatus.uninitialized,
    apiData: {
      pagination: {
        currentPage: 0,
        numPages: 0,
        numClients: 0,
        pageSize: 0
      },
      clients: []
    },
    page,
    search,
    sortField,
    sortOrder
  };
}
