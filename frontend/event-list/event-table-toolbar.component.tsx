import React from "react";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../styleguide.component";
import { EventListEvent } from "./event-list.component";
import backIcon from "../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../icons/148705-essential-collection/svg/next.svg";

export default function EventsTableToolbar(props: EventsTableToolbarProps) {
  const scope = useCss(css);
  const lastPage = Math.ceil(props.numEvents / props.pageSize);

  return (
    <div className="events-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        {lastPage !== 0 && (
          <div className="pagination-container">
            <div>
              {(props.page - 1) * props.pageSize + 1} -{" "}
              {Math.min(props.page * props.pageSize, props.numEvents)} of{" "}
              {props.numEvents.toLocaleString()}
            </div>
            <button
              className="icon"
              onClick={goBack}
              disabled={props.page === 1}
            >
              <img
                src={backIcon}
                alt="Go back one page"
                title="Go back one page"
              />
            </button>
            <button
              className="icon"
              onClick={goForward}
              disabled={props.page === lastPage}
            >
              <img
                src={nextIcon}
                alt="Go forward one page"
                title="Go forward one page"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function goBack() {
    props.setPage(props.page - 1);
  }

  function goForward() {
    props.setPage(props.page + 1);
  }
}

const css = `
  & .events-table-toolbar {
    position: sticky;
    top: 0;
    left: 23.6rem;
    padding: 0.25rem 1.4rem;
    z-index: 100;
    height: 4.25rem;
    width: 100%;
    background-color: white;
  }

  & .desktop-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  & .pagination-container {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

type EventsTableToolbarProps = {
  numEvents: number;
  page: number;
  pageSize: number;
  setPage(pageNum: number): void;
  fetchingEvents: boolean;
  refetchEvents: () => any;
};
