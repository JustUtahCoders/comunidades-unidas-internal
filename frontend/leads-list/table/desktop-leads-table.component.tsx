import React from "react";
import { useCss } from "kremling";
import dateformat from "dateformat";
import { LeadsTableProps } from "./leads-table.component";
import { formatPhone } from "../../util/formatters";
import targetImg from "../../../icons/148705-essential-collection/svg/target.svg";

export default function DesktopLeadsTable(props: LeadsTableProps) {
  const scope = useCss(css);

  return (
    <div className="table-container" {...scope}>
      <table className="leads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Event</th>
            <th>Signup Date</th>
            <th>Status</th>
            <th>Interests</th>
          </tr>
        </thead>
        <tbody
          role="group"
          aria-label="Select one or more lead for batch action"
        >
          {props.leads.length === 0 && !props.fetchingLeads ? (
            <tr className="empty-state">
              <td colSpan={7}>
                <div>
                  <img src={targetImg} alt="No leads" title="No leads" />
                  <p>No clients match the search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            props.leads.map(lead => {
              console.log(lead);
              return (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.fullName}</td>
                  <td>{formatPhone(lead.phone)}</td>
                  <td className="capitalize">
                    {lead.eventSources[lead.eventSources.length - 1].eventName}
                  </td>
                  <td>{dateformat(lead.dateOfSignUp, "m/d/yyyy")}</td>
                  <td className="status-cell">
                    {lead.leadStatus === "convertedToClient"
                      ? `Converted to client - see client #${lead.clientId}`
                      : lead.leadStatus === "inactive"
                      ? lead.inactivityReason === null
                        ? "Inactive - Reason not provided"
                        : lead.inactivityReason === "doNotCallRequest"
                        ? "Do not call request"
                        : lead.inactivityReason === "threeAttemptsNoResponse"
                        ? "No response after three attempts"
                        : lead.inactivityReason === "wrongNumber"
                        ? "Wrong number"
                        : lead.inactivityReason === "noLongerInterested"
                        ? "No longer interested"
                        : lead.inactivityReason === "relocated" &&
                          "No longer in Utah"
                      : lead.leadStatus === "active" &&
                        lead.contactStage.first === null
                      ? "Not Yet Contacted"
                      : lead.contactStage.first !== null &&
                        lead.contactStage.second === null
                      ? `First contact attempt made ${dateformat(
                          lead.contactStage.first,
                          "m/d/yyyy"
                        )}`
                      : lead.contactStage.second !== null &&
                        lead.contactStage.third === null
                      ? `Second contact attempt made ${dateformat(
                          lead.contactStage.second,
                          "m/d/yyyy"
                        )}`
                      : lead.contactStage.third !== null &&
                        `Third contact attempt made ${dateformat(
                          lead.contactStage.third,
                          "m/d/yyyy"
                        )}`}
                  </td>
                  <td className="interests-cell">
                    <ul className="cell-list">
                      {lead.leadServices.map(service => {
                        return <li key={service.id}>{service.serviceName}</li>;
                      })}
                    </ul>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

const css = `
  & .table-container {
    position: relative;
    width: 100%;
  }

  & table.leads-table {
    width: 100%;
    height: 100%;
    border-spacing: 0;
  }

  & .leads-table th {
    position: sticky;
    top: 6rem;
    background-color: var(--very-light-grey);
    box-shadow: 0 .2rem 0.2rem var(--medium-gray);
    padding: 0 1rem 0 1rem;
  }

  & .leads-table th button {
    display: block !important;
    width: 100% !important;
    height: 6rem !important;
    cursor: pointer;
  }

  & .leads-table th button: hover {
    background-color: var(--medium-gray);
  }

  & .leads-table thead {
    z-index: 100;
  }

  & .leads-table thead tr {
    height: 6rem;
  }

  & .leads-table tbody {
    background-color: white;
  }

  & .leads-table tbody tr:hover td {
    background-color: var(--very-light-gray);
  }  

  & .leads-table td {
    text-align: center;
    height: 4rem;
    border-bottom: .1rem solid var(--very-light-gray);
    padding: 0 1rem 0 1rem;
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

  & .cell-list {
    text-align: left;
  }

  & .capitalize {
    text-transform: capitalize;
  }

  & .status-cell {
    max-width: 20rem;
  }

  & .interests-cell {
    max-width: 20rem;
  }
`;
