import React from "react";
import { useCss, a } from "kremling";
import easyFetch from "../../util/easy-fetch";
import dayjs from "dayjs";
import { boxShadow2 } from "../../styleguide.component";
import { Link } from "@reach/router";
import { SingleClient } from "../view-client.component";
import ClientHistoryFilters from "./client-history-filters.component";
import EditLog from "./edit-log.component";
import ViewOutdatedLog from "./view-outdated-log.component";
import { partial } from "lodash-es";

export default function ClientHistory(props: ClientHistoryProps) {
  const [logState, dispatchLogState] = React.useReducer(
    logReducer,
    null,
    getInitialLogState
  );
  const scope = useCss(css);

  React.useEffect(() => {
    if (logState.isFetching) {
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
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [props.clientId, logState.isFetching]);

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
            to={`/clients/${props.clientId}/add-info`}
            className="secondary button"
            style={{ marginLeft: "1.6rem" }}
          >
            Add new item
          </Link>
        </div>
      </div>
      {logState.filteredLogs.map((log, index) => (
        <div
          className={a("client-history-timeline").m(
            "modifiable",
            log.canModify
          )}
          key={log.id}
          style={{ borderBottom: "1px solid darkgray" }}
          role="button"
          tabIndex={0}
          onClick={() => logClicked(log)}
        >
          <div className="timeline-left">
            {getDate(log, index)}
            <div
              className="timeline-circle"
              style={{ backgroundColor: getBackgroundColor(log.logType) }}
            />
          </div>
          <div className="timeline-right">
            <h4 className={a("title").m("outdated", log.idOfUpdatedLog)}>
              {getTitle(log)} by {log.createdBy.fullName}.
            </h4>
            {!log.idOfUpdatedLog && (
              <>
                {log.logType === "caseNote" && <i>{log.title}</i>}
                {log.description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: log.description }}
                    className="client-log-description"
                  />
                )}
              </>
            )}
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
            <h4 className="title">
              {props.client.fullName} filled out the intake form.
            </h4>
          </div>
        </div>
      )}
      {logState.logToModify && (
        <EditLog
          log={logState.logToModify}
          close={wasModified =>
            dispatchLogState({
              type: LogActionTypes.doneModifyingLog,
              wasModified
            })
          }
          clientId={props.clientId}
        />
      )}
      {logState.logToView && (
        <ViewOutdatedLog
          log={logState.logToView}
          close={() => {
            dispatchLogState({
              type: LogActionTypes.doneViewingOutdatedLog
            });
          }}
          viewUpdatedVersion={() => {
            const updatedLog = logState.allLogs.find(
              l => l.id === logState.logToView.idOfUpdatedLog
            );
            if (!updatedLog) {
              throw Error(
                `Cannot find the updated log with id '${logState.logToView.idOfUpdatedLog}' for log with id ${logState.logToView.id}`
              );
            }

            logClicked(updatedLog);
          }}
        />
      )}
    </div>
  );

  function getTitle(log) {
    switch (log.logType) {
      case LogType.caseNote:
        return "A case note was created";
      default:
        return log.title;
    }
  }

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

  function logClicked(log) {
    if (log.canModify) {
      if (log.idOfUpdatedLog) {
        dispatchLogState({
          type: LogActionTypes.viewOutdatedLog,
          log
        });
      } else {
        dispatchLogState({
          type: LogActionTypes.modifyLog,
          log
        });
      }
    }
  }
}

function logReducer(state: LogState, action: LogActions): LogState {
  switch (action.type) {
    case LogActionTypes.newFilters:
      const changeFilterAction = action as ChangeFilterAction;
      const result = {
        ...state,
        filters: changeFilterAction.newFilters,
        filteredLogs: state.allLogs.filter(
          partial(filterLogs, changeFilterAction.newFilters)
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
        isFetching: false,
        allLogs: setLogsAction.newLogs,
        filteredLogs: setLogsAction.newLogs.filter(
          partial(filterLogs, state.filters)
        )
      };
    case LogActionTypes.modifyLog:
      const modifyLogAction = action as ModifyLogAction;
      return {
        ...state,
        logToModify: modifyLogAction.log,
        logToView: null
      };
    case LogActionTypes.doneModifyingLog:
      const doneModifyingLogAction = action as DoneModifyingLogAction;
      return {
        ...state,
        isFetching: doneModifyingLogAction.wasModified,
        logToModify: null
      };
    case LogActionTypes.viewOutdatedLog:
      const viewOutdatedLogAction = action as ViewOutdatedLogAction;
      return {
        ...state,
        logToView: viewOutdatedLogAction.log,
        logToModify: null
      };
    case LogActionTypes.doneViewingOutdatedLog:
      return {
        ...state,
        logToView: null
      };
    default:
      throw Error();
  }
}

function filterLogs(filters, log) {
  const validType = filters[log.logType];
  const validOther = filters.showOutdated ? true : !log.idOfUpdatedLog;
  return validType && validOther;
}

type LogActions =
  | ChangeFilterAction
  | SetLogsAction
  | ModifyLogAction
  | DoneModifyingLogAction
  | ViewOutdatedLogAction
  | DoneViewingOutdatedLogAction;

type ChangeFilterAction = {
  type: LogActionTypes;
  newFilters: ClientHistoryFilterOptions;
};

type SetLogsAction = {
  type: LogActionTypes;
  newLogs: Array<ClientLog>;
};

type ModifyLogAction = {
  type: LogActionTypes;
  log: ClientLog;
};

type DoneModifyingLogAction = {
  type: LogActionTypes;
  wasModified: boolean;
};

type ViewOutdatedLogAction = {
  type: LogActionTypes;
  log: ClientLog;
};

type DoneViewingOutdatedLogAction = {
  type: LogActionTypes;
};

enum LogActionTypes {
  "newLogs" = "newLogs",
  "newFilters" = "newFilters",
  "modifyLog" = "modifyLog",
  "doneModifyingLog" = "doneModifyingLog",
  "viewOutdatedLog" = "viewOutdatedLog",
  "doneViewingOutdatedLog" = "doneViewingOutdatedLog"
}

function getBackgroundColor(logType: LogType) {
  switch (logType) {
    case LogType.caseNote:
      return "pink";
    case LogType.clientCreated:
      return "lightgreen";
    case LogType["clientUpdated:basicInformation"]:
    case LogType["clientUpdated:contactInformation"]:
    case LogType["clientUpdated:demographics"]:
    case LogType["clientUpdated:intakeData"]:
      return "lightblue";
    case LogType["clientInteraction:created"]:
    case LogType["clientInteraction:updated"]:
    case LogType["clientInteraction:deleted"]:
      return "yellow";
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

& .client-log-description {
  margin-top: 1.6rem;
}

& .modifiable:hover {
  background-color: var(--very-light-gray);
  cursor: pointer;
}

& .title {
  margin: 0;
}

& .outdated {
  text-decoration: line-through;
}
`;

export type ClientLog = {
  id: number;
  title: string;
  description?: string;
  logType: LogType;
  canModify: boolean;
  isDeleted: boolean;
  idOfUpdatedLog: number | null;
  detailId: number | null;
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
  "clientInteraction:created": boolean;
  "clientInteraction:updated": boolean;
  "clientInteraction:deleted": boolean;
  showOutdated: boolean;
};

export enum LogType {
  "clientCreated" = "clientCreated",
  "clientUpdated:basicInformation" = "clientUpdated:basicInformation",
  "clientUpdated:contactInformation" = "clientUpdated:contactInformation",
  "clientUpdated:demographics" = "clientUpdated:demographics",
  "clientUpdated:intakeData" = "clientUpdated:intakeData",
  "caseNote" = "caseNote",
  "clientInteraction:created" = "clientInteraction:created",
  "clientInteraction:updated" = "clientInteraction:updated",
  "clientInteraction:deleted" = "clientInteraction:deleted"
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
  let filters;
  if (localStorageFilters) {
    filters = JSON.parse(localStorageFilters);
    Object.keys(LogType).forEach(logType => {
      if (!filters.hasOwnProperty(logType) && logType !== "showOutdated") {
        filters[logType] = true;
      }
    });
  } else {
    filters = allFiltersOn;
  }
  return {
    isFetching: true,
    logToModify: null,
    logToView: null,
    allLogs: [],
    filteredLogs: [],
    filters
  };
}

type LogState = {
  allLogs: Array<ClientLog>;
  filteredLogs: Array<ClientLog>;
  filters: ClientHistoryFilterOptions;
  logToModify: ClientLog | null;
  logToView: ClientLog | null;
  isFetching: boolean;
};

type ClientHistoryProps = {
  path: string;
  clientId: string;
  client: SingleClient;
};
