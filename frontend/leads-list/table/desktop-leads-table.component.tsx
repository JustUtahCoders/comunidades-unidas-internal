import React from "react";
import { useCss, a } from "kremling";
import { Link } from "@reach/router";
import { formatPhone, formatDateWithoutTime } from "../../util/formatters";
import dateformat from "dateformat";
import dayjs from "dayjs";
import targetImg from "../../../icons/148705-essential-collection/svg/target.svg";
import phoneIcon from "../../../icons/148705-essential-collection/svg/telephone-symbol-button.svg";

export default function DesktopLeadsTable(props) {
  const scope = useCss(css);

  const mapLeads = props.leads.map((lead, i) => {
    return (
      <tr key={`row-${i}`}>
        <td>{lead.id}</td>
        <td>{lead.fullName}</td>
        <td>{formatPhone(lead.phone)}</td>
        <td>{lead.age}</td>
        <td>{lead.zip}</td>
        <td>
          {lead.leadStatus === "active"
            ? lead.contactStage.third !== null
              ? `3rd call on ${formatDateWithoutTime(lead.contactStage.third)}`
              : lead.contactStage.second !== null
              ? `2nd call on ${formatDateWithoutTime(lead.contactStage.second)}`
              : lead.contactStage.first !== null
              ? `1st call on ${formatDateWithoutTime(lead.contactStage.first)}`
              : `no call attempts made`
            : lead.leadStatus === "inactive"
            ? lead.inactivityReason !== null
              ? lead.inactivityReason
              : "inactive"
            : lead.leadStatus === "convertedToClient" && "converted to client"}
        </td>
        <td>{lead.eventSource.eventName}</td>
        <td>{lead.eventSource.eventLocation}</td>
        <td>{lead.dateOfSignUp}</td>
      </tr>
    );
  });

  return (
    <div className="table-container" {...scope}>
      <table className="leads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Age</th>
            <th>ZIP</th>
            <th>Status</th>
            <th>Event Source</th>
            <th>Event Location</th>
            <th>Event Date</th>
          </tr>
        </thead>
        <tbody>
          {props.leads.length === 0 && !props.fetchingLeads ? (
            <tr className="empty-state">
              <td colSpan={9}>
                <div>
                  <img src={targetImg} alt="No leads" title="No leads" />
                  <div>No leads match the search criteria</div>
                </div>
              </td>
            </tr>
          ) : (
            mapLeads
          )}
        </tbody>
      </table>
    </div>
  );
}

const css = `
	& .table-container {
    position: relative;
  }

  & table.leads-table {
    width: 100%;
    height: 100%;
    border-spacing: 0;
  }

  & .leads-table th {
    position: sticky;
    top: 6rem;
    background-color: var(--very-light-gray);
    box-shadow: 0 0.2rem 0.2rem var(--medium-gray);
  }

  & .leads-table th button {
    display: block !important;
    width: 100% !important;
    height: 6rem !important;
    cursor: pointer;
  }

  & .leads-table th button:hover {
    background-color: var(--medium-gray);
  }

  & .leads-table thead {
    z-index: 100;
  }

  & .leads-table thead tr {
    height: 6rem;
  }

  & .leads-table tbody tr:hover td {
    background-color: var(--very-light-gray);
  }
  
  & .leads-table tbody {
    background-color: white;
  }
  
  & .leads-table td {
    text-align: center;
    height: 4rem;
    border-bottom: .1rem solid var(--very-light-gray);
  }

  & .leads-table td a {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
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

  & .leads-table tbody tr.empty-state:hover td {
    background-color: white;
  }

  & .sort-icon {
    visibility: hidden
  }

  & .visible {
    visibility: visible;
  }

  & .table-icon {
    height: 2rem;
    margin: 0 0.5rem 0 0.5rem;
  }
`;
