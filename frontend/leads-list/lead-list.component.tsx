import React from "react";
import queryString from "query-string";
import easyFetch from "../util/easy-fetch";
import { useFullWidth } from "../navbar/use-full-width.hook";
import { SearchParseValues } from "../util/list-search/search-dsl.helpers";
import PageHeader from "../page-header.component";
import LeadsTable from "./table/leads-table.component";
import LeadsTableToolbar from "./toolbar/leads-table-toolbar.component";
import { CUEventSource } from "../view-edit-lead/view-lead.component";

export default function LeadList(props: LeadListProps) {
  const [selectedLeads, setSelectedLeads] = React.useState<SelectedLeads>({});
  const [programData, setProgramData] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [showingAdvancedSearch, setShowingAdvancedSearch] =
    React.useState(false);

  useFullWidth(true);

  const [apiState, dispatchApiState] = React.useReducer(
    reduceApiState,
    null,
    getInitialState
  );

  useAlwaysValidPage(apiState, dispatchApiState);
  useLeadsApi(apiState, dispatchApiState);
  useFrontendUrlParams(apiState, dispatchApiState);

  const fetchingLead = apiState.status !== ApiStateStatus.fetched;

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/services`, { signal: abortController.signal })
      .then((json) => {
        setProgramData(json);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/events`, { signal: abortController.signal })
      .then((json) => {
        setEvents(json.events);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  return (
    <>
      <PageHeader title="Lead List" fullScreen={true} />
      <LeadsTableToolbar
        numLeads={apiState.apiData.pagination.numLeads}
        page={apiState.page}
        pageSize={apiState.apiData.pagination.pageSize}
        setPage={newPage}
        fetchingLead={fetchingLead}
        refetchLeads={refetchLeads}
        setSearch={setSearch}
        selectedLeads={selectedLeads}
        setSelectedLeads={setSelectedLeads}
        programData={programData}
        events={events}
        showingAdvancedSearch={showingAdvancedSearch}
        setShowingAdvancedSearch={setShowingAdvancedSearch}
        initialSearchValue={apiState.search}
      />
      <LeadsTable
        leads={apiState.apiData.leads}
        fetchingLeads={fetchingLead}
        page={apiState.page}
        newSortOrder={newSortOrder}
        sortField={apiState.sortField}
        sortOrder={apiState.sortOrder}
        selectedLeads={selectedLeads}
        setSelectedLeads={setSelectedLeads}
        programData={programData}
        events={events}
        advancedSearchOpen={showingAdvancedSearch}
      />
    </>
  );

  function newPage(page: number) {
    dispatchApiState({
      type: ActionTypes.newPage,
      page,
    });
  }

  function refetchLeads() {
    dispatchApiState({
      type: ActionTypes.shouldFetch,
    });
  }

  function setSearch(search) {
    dispatchApiState({
      type: ActionTypes.newSearch,
      search,
    });
  }

  function newSortOrder(sortField: SortField, sortOrder: SortOrder) {
    dispatchApiState({
      type: ActionTypes.newSort,
      sortField,
      sortOrder,
    });
  }
}

function reduceApiState(state: ApiState, action: ApiStateAction) {
  switch (action.type) {
    case ActionTypes.fetching:
      return {
        ...state,
        status: ApiStateStatus.fetching,
      };
    case ActionTypes.fetched:
      return {
        ...state,
        status: ApiStateStatus.fetched,
        apiData: action.apiData,
      };
    case ActionTypes.newPage:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        page: action.page,
      };
    case ActionTypes.newSearch:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        search: action.search,
      };
    case ActionTypes.newQueryParams:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
      };
    case ActionTypes.apiError:
      return {
        ...state,
        status: ApiStateStatus.fetched,
      };
    case ActionTypes.shouldFetch:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
      };
    case ActionTypes.newSort:
      return {
        ...state,
        status: ApiStateStatus.shouldFetch,
        sortField: action.sortField,
        sortOrder: action.sortOrder,
        page: 1,
      };
    default:
      throw Error();
  }
}

function useLeadsApi(apiState, dispatchApiState) {
  React.useEffect(() => {
    if (apiState.status === ApiStateStatus.shouldFetch) {
      const abortController = new AbortController();
      const query = queryString.stringify({
        ...apiState.search,
        sortField: apiState.sortField,
        sortOrder: apiState.sortOrder,
        page: apiState.page,
      });
      easyFetch(`/api/leads?${query}`)
        .then((data) => {
          dispatchApiState({
            type: ActionTypes.fetched,
            apiData: data,
          });
        })
        .catch((err) => {
          dispatchApiState({
            type: ActionTypes.apiError,
            err,
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
      return;
    }

    const lastPage = Math.ceil(
      apiState.apiData.pagination.numLeads /
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
        page: newPage,
      });
    }
  }, [apiState]);
}

function useFrontendUrlParams(apiState, dispatchApiState) {
  React.useEffect(() => {
    const params = queryString.parse(window.location.search);
    dispatchApiState({
      type: ActionTypes.newQueryParams,
      params,
    });
  }, []);

  React.useEffect(() => {
    const queryParams = queryString.stringify({
      page: apiState.page,
      sortField: apiState.sortField,
      sortOrder: apiState.sortOrder,
      ...apiState.search,
    });

    window.history.replaceState(
      window.history.state,
      document.title,
      window.location.pathname + "?" + queryParams
    );

    if (apiState.status !== ApiStateStatus.uninitialized) {
      localStorage.setItem(
        "lead-search",
        queryString.stringify(apiState.search)
      );
    }
  }, [apiState]);
}

function getInitialState(): ApiState {
  const queryParams = {
    ...queryString.parse(localStorage.getItem("lead-search") || ""),
    ...queryString.parse(window.location.search),
  };

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
        numLeads: 0,
        pageSize: 0,
      },
      leads: [],
    },
    page,
    search,
    sortField,
    sortOrder,
  };
}

export function reversedSortOrder(oldOrder: SortOrder) {
  return oldOrder === SortOrder.ascending
    ? SortOrder.descending
    : SortOrder.ascending;
}

enum ApiStateStatus {
  shouldFetch = "shouldFetch",
  fetching = "fetching",
  fetched = "fetched",
  uninitialized = "uninitialized",
}

enum ActionTypes {
  fetching = "fetching",
  fetched = "fetched",
  newPage = "newPage",
  newQueryParams = "newQueryParams",
  apiError = "apiError",
  shouldFetch = "shouldFetch",
  newSearch = "newSearch",
  newSort = "newSort",
}

export enum SortField {
  id = "id",
  firstName = "firstName",
  lastName = "lastName",
  dateOfSignUp = "dateOfSignUp",
}

export enum SortOrder {
  ascending = "asc",
  descending = "desc",
}

type ApiStateAction =
  | NewPageAction
  | NewParamsAction
  | FetchingAction
  | FetchedAction
  | ShouldFetchAction
  | ApiErrorAction
  | NewSearchAction
  | NewSortAction;

type ApiState = {
  status: ApiStateStatus;
  page: number;
  apiData: LeadApiData;
  search: SearchParseValues;
  sortField: SortField;
  sortOrder: SortOrder;
};

type FetchedAction = {
  type: ActionTypes.fetched;
  apiData: LeadApiData;
};

type FetchingAction = {
  type: ActionTypes.fetching;
};

type LeadApiData = {
  leads: LeadListLead[];
  pagination: {
    numLeads: number;
    currentPage: number;
    pageSize: number;
    numPages: number;
  };
};

type LeadListProps = {
  path: string;
};

type NewPageAction = {
  type: ActionTypes.newPage;
  page: number;
};

type NewParamsAction = {
  type: ActionTypes.newQueryParams;
  params: SearchParseValues & {
    page: number;
  };
};

type NewSortAction = {
  type: ActionTypes.newSort;
  sortField: SortField;
  sortOrder: SortOrder;
};

type NewSearchAction = {
  type: ActionTypes.newSearch;
  search: SearchParseValues;
};

type ShouldFetchAction = {
  type: ActionTypes.shouldFetch;
};

type ApiErrorAction = {
  type: ActionTypes.apiError;
  err: any;
};

export type LeadListLead = {
  id: number;
  dateOfSignUp: string;
  leadStatus: string;
  contactStage: {
    first: string;
    second: string;
    third: string;
  };
  inactivityReason: string;
  eventSources: Array<number>;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  smsConsent: boolean;
  zip: string;
  age: number;
  gender: string;
  leadServices: Array<number>;
  clientId: number;
  createdBy: {
    userId: number;
    fullName: string;
    timestamp: string;
  };
};

export type SelectedLeads = {
  [leadId: number]: LeadListLead;
};
