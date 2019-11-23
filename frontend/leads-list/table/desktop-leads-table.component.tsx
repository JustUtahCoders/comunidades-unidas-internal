import React from "react";
import { Link } from "@reach/router";
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
          aria-label="Select one or more leads for batch action"
        >
          {props.leads.length === 0 && !props.fetchingLeads ? (
            <tr className="empty-state">
              <td colSpan={7}>
                <div>
                  <img src={targetImg} alt="No leads" title="No leads" />
                  <p>No leads match the search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            props.leads.map(lead => {
              return (
                <tr key={lead.id}>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {lead.id}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {lead.fullName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {formatPhone(lead.phone)}
                    </Link>
                  </td>
                  <td className="capitalize">
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {
                        lead.eventSources[lead.eventSources.length - 1]
                          .eventName
                      }
                    </Link>
                  </td>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {dateformat(lead.dateOfSignUp, "m/d/yyyy")}
                    </Link>
                  </td>
                  <td
                    className="status-cell"
                    style={leadStatusColor(lead.leadStatus)}
                  >
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      {determineLeadStatus(
                        lead.leadStatus,
                        lead.clientId,
                        lead.contactStage,
                        lead.inactivityReason
                      )}
                    </Link>
                  </td>
                  <td className="interests-cell">
                    <Link to={`/leads/${lead.id}`} className="unstyled">
                      <ul>
                        {lead.leadServices.map(service => {
                          return (
                            <li key={service.id}>{service.serviceName}</li>
                          );
                        })}
                      </ul>
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

  function leadStatusColor(leadStatus) {
    if (leadStatus === "active") {
      return {
        color: "#000000"
      };
    } else if (leadStatus === "inactive") {
      return {
        color: "#B30000"
      };
    } else if (leadStatus === "convertedToClient") {
      return {
        color: "#006600"
      };
    }
  }

  function determineLeadStatus(
    leadStatus,
    clientId,
    contactStage,
    inactivityReason
  ) {
    if (leadStatus === "convertedToClient") {
      return `Converted to client (see client #${clientId}`;
    } else if (leadStatus === "active") {
      if (contactStage.first === null) {
        return "Not yet contacted";
      } else {
        if (contactStage.second === null) {
          return `First contact attempt made on ${dateformat(
            contactStage.first,
            "m/d/yyyy"
          )}`;
        } else {
          if (contactStage.third === null) {
            return `Second contact attempt made on ${dateformat(
              contactStage.second,
              "m/d/yyyy"
            )}`;
          } else {
            return `Third contact attempt made on ${dateformat(
              contactStage.third,
              "m/d/yyyy"
            )}`;
          }
        }
      }
    } else if (leadStatus === "inactive") {
      switch (inactivityReason) {
        case "doNotCallRequest":
          return "Do not call request";
          break;
        case "threeAttemptsNoResponse":
          return "Three attempts made, no response";
          break;
        case "wrongNumber":
          return "Wrong number";
          break;
        case "noLongerInterested":
          return "No longer interested";
          break;
        case "relocated":
          return "No longer in Utah";
          break;
        default:
          return "Inactive - no reason provided";
          break;
      }
    } else {
      return "Status unknown";
    }
  }
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

  & .capitalize {
    text-transform: capitalize;
  }

  & .status-cell {
    max-width: 20rem;
  }

  & .interests-cell {
    max-width: 20rem;
  }

  & .interests-cell > a > ul {
    width: 100%;
    text-align: left;
  }

  & .interests-cell > a > ul > li {
    margin-bottom: 0.75rem;
  }

`;
