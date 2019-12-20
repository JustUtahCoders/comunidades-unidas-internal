import React from "react";
import { Link } from "@reach/router";
import { useCss, a } from "kremling";
import dateformat from "dateformat";
import { EventTableProps } from "./event-table.component";
import {
  reversedSortOrder,
  SortField,
  SortOrder
} from "./event-list.component";
import targetImg from "../../icons/148705-essential-collection/svg/target.svg";

export default function DesktopEventTable(props: EventTableProps) {
  const scope = useCss(css);

  return (
    <div className="table-container" {...scope}>
      <table className="events-table">
        <thead>
          <tr>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.id)}
              >
                ID{sortableColumnIcon(SortField.id)}
              </button>
            </th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.eventName)}
              >
                Event Name{sortableColumnIcon(SortField.eventName)}
              </button>
            </th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.eventDate)}
              >
                Event Date{sortableColumnIcon(SortField.eventDate)}
              </button>
            </th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.eventLocation)}
              >
                Event Location{sortableColumnIcon(SortField.eventLocation)}
              </button>
            </th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.totalAttendance)}
              >
                Total Attendance{sortableColumnIcon(SortField.totalAttendance)}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.events.length === 0 && !props.fetchingEvents ? (
            <tr className="empty-state">
              <td colSpan={7}>
                <div>
                  <img src={targetImg} alt="No events" title="No events" />
                  <p>No events match the search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            props.events.map(event => {
              return (
                <tr>
                  <td>
                    <Link to={`/events/${event.id}`} className="unstyled">
                      {event.id}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/events/${event.id}`} className="unstyled">
                      {event.eventName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/events/${event.id}`} className="unstyled">
                      {event.eventDate}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/events/${event.id}`} className="unstyled">
                      {event.eventLocation}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/events/${event.id}`} className="unstyled">
                      {event.totalAttendance}
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  function sortColumnClicked(sortField: SortField) {
    return () => {
      if (props.sortField === sortField) {
        props.newSortOrder(sortField, reversedSortOrder(props.sortOrder));
      } else {
        props.newSortOrder(sortField, SortOrder.ascending);
      }
    };
  }

  function sortableColumnIcon(...sortFields: SortField[]) {
    return (
      <span
        className={a("sort-icon").m(
          "visible",
          sortFields.includes(props.sortField)
        )}
      >
        {props.sortOrder === SortOrder.ascending ? "\u2191" : "\u2193"}
      </span>
    );
  }
}

const css = `
  & .table-container {
    position: relative;
    width: 100%;
	}
	
	& table.events-table {
    width: 100%;
    height: 100%;
    border-spacing: 0;
	}
	
	& .events-table th {
    position: sticky;
    top: 6rem;
    background-color: var(--very-light-grey);
    box-shadow: 0 .2rem 0.2rem var(--medium-gray);
    padding: 0 1rem 0 1rem;
	}
	
	& .events-table th button {
    display: block !important;
    width: 100% !important;
    height: 6rem !important;
    cursor: pointer;
	}
	
	& .events-table th button: hover {
    background-color: var(--medium-gray);
  }

  & .events-table thead {
    z-index: 100;
  }

  & .events-table thead tr {
    height: 6rem;
  }

  & .events-table tbody {
    background-color: white;
  }

  & .events-table tbody tr:hover td {
    background-color: var(--very-light-gray);
  }  

  & .events-table td {
    text-align: center;
    height: 4rem;
    border-bottom: .1rem solid var(--very-light-gray);
    padding: 0 1rem 0 1rem;
  }

  & .events-table td a {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  & .loading-overlay {
    position: absolute;
    top: 6rem;
    left: 0;
    width: 100%;
    height: calc(100% - 6rem);
    z-index: 10;
    background-color: var(--light-gray);
    opacity: 0.7;
  }

  & .empty-state img {
    width: 10rem;
    padding: 1rem;
  }

  & .empty-state > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15rem;
  }

  & .empty-state td {
    padding: 1.6rem;
  }

  & .events-table tbody tr.empty-state:hover td {
    background-color: white;
  }

  & .sort-icon {
    visibility: hidden
  }

  & .visible {
    visibility: visible;
  }

  & .capitalize {
    text-transform: capitalize;
  }
`;
