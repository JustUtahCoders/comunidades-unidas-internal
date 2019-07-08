import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import dayjs from "dayjs";
import { boxShadow2 } from "../../styleguide.component";
import { Link } from "@reach/router";
import { SingleClient } from "../view-client.component";
import ClientHistoryFilters from "./client-history-filters.component";

export default function ClientHistory(props: ClientHistoryProps) {
  const [logState, dispatchLogState] = React.useReducer(
    logReducer,
    null,
    getInitialLogState
  );
  const scope = useCss(css);

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/clients/${props.clientId}/logs`)
      .then(data => {
        dispatchLogState({
          type: LogActionTypes.newLogs,
          newLogs: data.logs.map(log => ({
            ...log,
            createdBy: {
              ...log.createdBy,
              timestamp: dayjs(log.createdBy.timestamp)
            }
          }))
        });
      })
      .catch(err => {
        console.error(err);
        showGrowl({
          type: GrowlType.error,
          message: `Could not load the client history for client ${props.clientId}.`
        });
      });

    return () => abortController.abort();
  }, [props.clientId]);

  return (
    <div {...scope} className="card">
      <div className="client-history-header">
        <h3>Client history</h3>
        <ClientHistoryFilters
          filters={logState.filters}
          setFilters={updateFilters}
        />
      </div>
      <div className="client-history-timeline bookend">
        <div className="timeline-left">
          <div
            className="timeline-circle"
            style={{ top: 0, backgroundColor: "white" }}
          />
        </div>
        <div style={{ marginBottom: ".8rem" }}>
          <Link
            to={`/clients/${props.clientId}/add-entry`}
            className="secondary button"
            style={{ marginLeft: "1.6rem" }}
          >
            Add new item
          </Link>
        </div>
      </div>
      {logState.filteredLogs.map((log, index) => (
        <div className="client-history-timeline" key={log.id}>
          <div className="timeline-left">
            {getDate(log, index)}
            <div
              className="timeline-circle"
              style={{ backgroundColor: getBackgroundColor(log.logType) }}
            />
          </div>
          <div className="timeline-right">
            {log.title} by {log.createdBy.fullName}.
          </div>
        </div>
      ))}
      {props.client && (
        <div className="client-history-timeline bookend">
          <div className="timeline-left">
            <div style={{ alignSelf: "flex-end" }}>
              {dayjs(props.client.dateOfIntake).format("MMM D, YYYY")}
            </div>
            <div
              className="timeline-circle"
              style={{ top: `calc(100% - 1.6rem)`, backgroundColor: "black" }}
            />
          </div>
          <div className="timeline-right" style={{ marginBottom: 0 }}>
            {props.client.fullName} filled out the intake form.
          </div>
        </div>
      )}
    </div>
  );

  function getDate(log, index) {
    if (
      index === 0 ||
      !logState.filteredLogs[index - 1].createdBy.timestamp.isSame(
        log.createdBy.timestamp,
        "year"
      )
    ) {
      return (
        <>
          <div>{log.createdBy.timestamp.format("MMM D, YYYY")}</div>
          <div>{log.createdBy.timestamp.format("h:mm a")}</div>
        </>
      );
    } else if (
      !logState.filteredLogs[index - 1].createdBy.timestamp.isSame(
        log.createdBy.timestamp,
        "day"
      )
    ) {
      return <div>{log.createdBy.timestamp.format("MMM D h:mm a")}</div>;
    } else if (
      !logState.filteredLogs[index - 1].createdBy.timestamp.isSame(
        log.createdBy.timestamp,
        "minute"
      )
    ) {
      return <div>{log.createdBy.timestamp.format("h:mm a")}</div>;
    } else {
      return null;
    }
  }

  function updateFilters(filters: ClientHistoryFilterOptions) {
    dispatchLogState({
      type: LogActionTypes.newFilters,
      newFilters: filters
    });
  }
}

function logReducer(state: LogState, action: LogActions): LogState {
  console.log("state", state, "action", action);
  switch (action.type) {
    case LogActionTypes.newFilters:
      const changeFilterAction = action as ChangeFilterAction;
      const result = {
        ...state,
        filters: changeFilterAction.newFilters,
        filteredLogs: state.allLogs.filter(
          log => changeFilterAction.newFilters[log.logType]
        )
      };
      localStorage.setItem(
        "cu:client-history-filters",
        JSON.stringify(result.filters)
      );
      return result;
    case LogActionTypes.newLogs:
      const setLogsAction = action as SetLogsAction;
      return {
        ...state,
        allLogs: setLogsAction.newLogs,
        filteredLogs: setLogsAction.newLogs.filter(
          log => state.filters[log.logType]
        )
      };
    default:
      throw Error();
  }
}

type LogActions = ChangeFilterAction | SetLogsAction;

type ChangeFilterAction = {
  type: LogActionTypes;
  newFilters: ClientHistoryFilterOptions;
};

type SetLogsAction = {
  type: LogActionTypes;
  newLogs: Array<ClientLog>;
};

enum LogActionTypes {
  "newLogs" = "newLogs",
  "newFilters" = "newFilters"
}

function getBackgroundColor(logType: LogType) {
  switch (logType) {
    case LogType.caseNote:
      return "lightorange";
    case LogType.clientCreated:
      return "lightgreen";
    case LogType["clientUpdated:basicInformation"]:
    case LogType["clientUpdated:contactInformation"]:
    case LogType["clientUpdated:demographics"]:
    case LogType["clientUpdated:intakeData"]:
      return "lightblue";
    default:
      return "black";
  }
}

const css = `
& .client-history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3.2rem;
}

& .client-history-header > h3 {
  margin: 0;
}

& .client-history-timeline {
  display: flex;
}

& .client-history-timeline + & .client-history-timeline {
  margin-top: 2.4rem;
}

& .timeline-left {
  font-size: 1.2rem;
  border-right: .4rem solid darkgray;
  text-align: center;
  max-width: 7rem;
  min-width: 7rem;
  margin-right: .4rem;
  padding-right: .8rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

& .timeline-right {
  width: 100%;
  position: relative;
  margin: 1.6rem;
}

& .timeline-circle {
  position: relative;
  border: .1rem solid black;
}

& .timeline-circle {
  position: absolute;
  top: calc(50% - .8rem);
  right: -1rem;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: .8rem;
  min-height: 1.6rem;
  box-shadow: ${boxShadow2};
}

& .bookend {
  min-height: 2.4rem;
}
`;

type ClientLog = {
  id: number;
  title: string;
  logType: LogType;
  canModify: boolean;
  isDeleted: boolean;
  createdBy: {
    userId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    timestamp: dayjs.Dayjs;
  };
};

export type ClientHistoryFilterOptions = {
  clientCreated: boolean;
  "clientUpdated:basicInformation": boolean;
  "clientUpdated:contactInformation": boolean;
  "clientUpdated:demographics": boolean;
  "clientUpdated:intakeData": boolean;
  caseNote: boolean;
};

export enum LogType {
  "clientCreated" = "clientCreated",
  "clientUpdated:basicInformation" = "clientUpdated:basicInformation",
  "clientUpdated:contactInformation" = "clientUpdated:contactInformation",
  "clientUpdated:demographics" = "clientUpdated:demographics",
  "clientUpdated:intakeData" = "clientUpdated:intakeData",
  "caseNote" = "caseNote"
}

const allFiltersOn: ClientHistoryFilterOptions = Object.keys(LogType).reduce(
  (acc, logType) => {
    acc[logType] = true;
    return acc;
  },
  {}
) as ClientHistoryFilterOptions;

function getInitialLogState(): LogState {
  const localStorageFilters = localStorage.getItem("cu:client-history-filters");
  return {
    allLogs: [],
    filteredLogs: [],
    filters: localStorageFilters
      ? JSON.parse(localStorageFilters)
      : allFiltersOn
  };
}

type LogState = {
  allLogs: Array<ClientLog>;
  filteredLogs: Array<ClientLog>;
  filters: ClientHistoryFilterOptions;
};

type ClientHistoryProps = {
  path: string;
  clientId: string;
  client: SingleClient;
};
