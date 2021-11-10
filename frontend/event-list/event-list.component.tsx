import React from "react";
import queryString from "query-string";
import easyFetch from "../util/easy-fetch";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import EventTableToolbar from "./event-table-toolbar.component";
import EventTable from "./event-table.component";
import { useAlwaysValidPage } from "../util/use-always-valid-page";

export default function EventList(props: EventListProps) {
  useFullWidth(true);

  const [apiState, dispatchApiState] = React.useReducer(
    reduceApiState,
    null,
    getInitialState
  );

  useAlwaysValidPage(apiState, ApiStateStatus, ActionTypes, dispatchApiState);
  useEventsApi(apiState, dispatchApiState);
  useFrontendUrlParams(apiState, dispatchApiState);

  const fetchingEvents = apiState.status != ApiStateStatus.fetched;

  return (
    <>
      <PageHeader title="Events List" fullScreen={true} />
      <EventTableToolbar
        numEvents={apiState.apiData.pagination.numEvents}
        page={apiState.page}
        pageSize={apiState.apiData.pagination.pageSize}
        setPage={newPage}
        fetchingEvents={fetchingEvents}
        refetchEvents={refetchEvents}
      />
      <EventTable
        events={apiState.apiData.events}
        fetchingEvents={fetchingEvents}
        page={apiState.page}
        newSortOrder={newSortOrder}
        sortField={apiState.sortField}
        sortOrder={apiState.sortOrder}
      />
    </>
  );

  function newPage(page: number) {
    dispatchApiState({
      type: ActionTypes.newPage,
      page,
    });
  }

  function refetchEvents() {
    dispatchApiState({
      type: ActionTypes.shouldFetch,
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

function useEventsApi(apiState, dispatchApiState) {
  React.useEffect(() => {
    if (apiState.status === ApiStateStatus.shouldFetch) {
      const abortController = new AbortController();
      const query = queryString.stringify({
        page: apiState.page,
        sortField: apiState.sortField,
        sortOrder: apiState.sortOrder,
      });
      easyFetch(`/api/events?${query}`)
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
    });

    window.history.replaceState(
      window.history.state,
      document.title,
      window.location.pathname + "?" + queryParams
    );
  }, [apiState]);
}

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
    sortField = SortField.eventDate;
  }

  let sortOrder = queryParams.sortOrder as SortOrder;

  if (!Object.values(SortOrder).includes(sortOrder)) {
    sortOrder = SortOrder.descending;
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
        numEvents: 0,
        pageSize: 0,
      },
      events: [],
    },
    page,
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
  newSort = "newSort",
}

export enum SortField {
  id = "id",
  eventName = "eventName",
  eventDate = "eventDate",
  eventLocation = "eventLocation",
  totalAttendance = "totalAttendance",
  totalMaterialsDistributed = "totalMaterialsDistributed",
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
  | NewSortAction;

type ApiState = {
  status: ApiStateStatus;
  page: number;
  apiData: EventApiData;
  sortField: SortField;
  sortOrder: SortOrder;
};

type FetchedAction = {
  type: ActionTypes.fetched;
  apiData: EventApiData;
};

type FetchingAction = {
  type: ActionTypes.fetching;
};

type EventApiData = {
  events: EventListEvent[];
  pagination: {
    numEvents: number;
    currentPage: number;
    pageSize: number;
    numPages: number;
  };
};

type EventListProps = {
  path: string;
};

type NewPageAction = {
  type: ActionTypes.newPage;
  page: number;
};

type NewParamsAction = {
  type: ActionTypes.newQueryParams;
  params: {
    page: number;
  };
};

type ShouldFetchAction = {
  type: ActionTypes.shouldFetch;
};

type ApiErrorAction = {
  type: ActionTypes.apiError;
  err: any;
};

type NewSortAction = {
  type: ActionTypes.newSort;
  sortField: SortField;
  sortOrder: SortOrder;
};

export type EventListEvent = {
  id: number;
  eventDate: string;
  eventName: string;
  eventLocation: string;
  totalAttendance: number;
  totalMaterialsDistributed: number;
  createdBy: {
    userId: number;
    fullName: string;
    timestamp: string;
  };
};
