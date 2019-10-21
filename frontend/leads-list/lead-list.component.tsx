import React from "react";
import queryString from "query-string";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ReportIssue from "../report-issue/report-issue.component";
import LeadsTable from "./table/leads-table.component";
import { SearchParseValues } from "../client-search/client-list/client-search-dsl.helpers";
import { SortField, SortOrder } from "../client-list/client-list.component";

export default function LeadList(props: LeadListProps) {
  if (localStorage.getItem("leads") !== null) {
    useFullWidth();
  }

  // const [apiState, dispatchApiState] = React.useReducer(
  //   reduceApiState,
  //   null,
  //   getInitialState
  // )

  return (
    <>
      <PageHeader title="Lead List" fullScreen />
      {localStorage.getItem("leads") ? (
        <>
          <LeadsTable />
        </>
      ) : (
        <ReportIssue missingFeature hideHeader />
      )}
    </>
  );
}

function reduceApiState(state: ApiState, action: ApiStateAction) {
  // switch(action.type) {
  //   case ActionTypes.fetching:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.fetching
  //     }
  //   case ActionTypes.fetched:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.fetched,
  //       apiData: action.apiData
  //     };
  //   case ActionTypes.newPage:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.shouldFetch,
  //       page: action.page
  //     };
  //   case ActionTypes.newQueryParams:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.shouldFetch
  //     };
  //   case ActionTypes.apiError:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.fetched
  //     };
  //   case ActionTypes.shouldFetch:
  //     return {
  //       ...state,
  //       status: ApiStateStatus.shouldFetch
  //     };
  //   default:
  //     throw Error();
  // }
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

  const search = { ...queryParams };
  delete search.page;

  return {
    status: ApiStateStatus.uninitialized,
    apiData: {
      pagination: {
        currentPage: 0,
        numPages: 0,
        numLeads: 0,
        pageSize: 0
      },
      leads: []
    },
    page
    // search
  };
}

enum ApiStateStatus {
  shouldFetch = "shouldFetch",
  fetching = "fetching",
  fetched = "fetched",
  uninitialized = "uninitialized"
}

enum ActionTypes {
  fetching = "fetching",
  fetched = "fetched",
  newPage = "newPage",
  newQueryParams = "newQueryParams",
  apiError = "apiError",
  shouldFetch = "shouldFetch"
}

type ApiStateAction =
  | NewPageAction
  | NewSearchAction
  | NewParamsAction
  | FetchingAction
  | FetchedAction
  | ShouldFetchAction
  | ApiErrorAction;

type ApiState = {
  status: ApiStateStatus;
  page: number;
  apiData: LeadApiData;
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

type NewSearchAction = {
  // type: ActionTypes.newSearch;
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
};
