import React from "react";
import { Link } from "@reach/router";
import { useCss, a } from "kremling";
import dateformat from "dateformat";
import { LeadsTableProps } from "./leads-table.component";
import {
  reversedSortOrder,
  SortField,
  SortOrder,
} from "../lead-list.component";
import { formatPhone } from "../../util/formatters";
import LeadServicesCell from "./lead-services-cell.component";
import targetImg from "../../../icons/148705-essential-collection/svg/target.svg";
import { startCase } from "lodash-es";

export default function DesktopLeadsTable(props: LeadsTableProps) {
  const scope = useCss(css);
  const [selectAll, setSelectAll] = React.useState(false);

  React.useEffect(() => {
    if (selectAll) {
      props.setSelectedLeads(
        props.leads.reduce((result, lead) => {
          result[lead.id] = lead;
          return result;
        }, {})
      );
    } else {
      props.setSelectedLeads({});
    }
  }, [selectAll, props.leads]);

  return (
    <div className="table-container" {...scope}>
      <table
        className={a("leads-table").m(
          "advanced-search",
          props.advancedSearchOpen
        )}
      >
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(evt) => setSelectAll(evt.target.checked)}
                name="select-all"
                aria-label="Select all leads"
              />
            </th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.id)}
              >
                ID{sortableColumnIcon(SortField.id)}
              </button>
            </th>
            <th>
              <button className="unstyled" onClick={sortNameClicked}>
                {props.sortField === SortField.firstName ||
                props.sortField === SortField.lastName
                  ? startCase(props.sortField)
                  : "Name"}
                {sortableColumnIcon(SortField.firstName, SortField.lastName)}
              </button>
            </th>
            <th>Phone</th>
            <th>Event</th>
            <th>
              <button
                className="unstyled"
                onClick={sortColumnClicked(SortField.dateOfSignUp)}
              >
                Signup Date{sortableColumnIcon(SortField.dateOfSignUp)}
              </button>
            </th>
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
              <td colSpan={8}>
                <div>
                  <img src={targetImg} alt="No leads" title="No leads" />
                  <p>No leads match the search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            props.leads.map((lead) => {
              return (
                <tr key={lead.id}>
                  <td onClick={() => handleCheckBoxChange(lead)}>
                    <input
                      type="checkbox"
                      name="lead-checked"
                      aria-label={`Selected ${lead.fullName}`}
                      value={lead.id}
                      checked={Boolean(props.selectedLeads[lead.id])}
                      onChange={() => {}}
                    />
                  </td>
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
                    {lead.eventSources.length > 0 ? (
                      <Link to={`/leads/${lead.id}`} className="unstyled">
                        {
                          lead.eventSources[lead.eventSources.length - 1]
                            .eventName
                        }
                      </Link>
                    ) : (
                      "\u2014"
                    )}
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
                      <LeadServicesCell
                        leadServices={lead.leadServices}
                        programData={props.programData}
                      />
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
        color: "#000000",
      };
    } else if (leadStatus === "inactive") {
      return {
        color: "#B30000",
      };
    } else if (leadStatus === "convertedToClient") {
      return {
        color: "#006600",
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
      return `Client #${clientId}`;
    } else if (leadStatus === "active") {
      if (contactStage.first === null) {
        return "No contact";
      } else if (contactStage.second === null) {
        return (
          <span title={dateformat(contactStage.first, "m/d/yyyy")}>1 call</span>
        );
      } else if (contactStage.third === null) {
        return (
          <span title={dateformat(contactStage.second, "m/d/yyyy")}>
            2 calls
          </span>
        );
      } else {
        return (
          <span title={dateformat(contactStage.third, "m/d/yyyy")}>
            3 calls
          </span>
        );
      }
    } else if (leadStatus === "inactive") {
      switch (inactivityReason) {
        case "doNotCallRequest":
          return "Do not call";
        case "threeAttemptsNoResponse":
          return "No response";
        case "wrongNumber":
          return "Wrong number";
        case "noLongerInterested":
          return "Not interested";
        case "relocated":
          return "Relocated";
        default:
          return "Inactive";
      }
    } else {
      return "Unknown";
    }
  }

  function sortColumnClicked(sortField: SortField) {
    return () => {
      if (props.sortField === sortField) {
        props.newSortOrder(sortField, reversedSortOrder(props.sortOrder));
      } else {
        props.newSortOrder(sortField, SortOrder.ascending);
      }
    };
  }

  function sortNameClicked() {
    if (props.sortField === SortField.firstName) {
      if (props.sortOrder === SortOrder.ascending) {
        props.newSortOrder(SortField.firstName, SortOrder.descending);
      } else {
        props.newSortOrder(SortField.lastName, SortOrder.ascending);
      }
    } else if (props.sortField === SortField.lastName) {
      if (props.sortOrder === SortOrder.ascending) {
        props.newSortOrder(SortField.lastName, SortOrder.descending);
      } else {
        props.newSortOrder(SortField.firstName, SortOrder.ascending);
      }
    } else {
      props.newSortOrder(SortField.lastName, SortOrder.ascending);
    }
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

  function handleCheckBoxChange(lead) {
    const newSelectedLeads = Object.assign({}, props.selectedLeads);
    if (props.selectedLeads[lead.id]) {
      delete newSelectedLeads[lead.id];
    } else {
      newSelectedLeads[lead.id] = lead;
    }

    props.setSelectedLeads(newSelectedLeads);
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
    font-size: 1.5rem;
  }

  & .leads-table th {
    position: sticky;
    top: 5.5rem;
    background-color: var(--very-light-gray);
    box-shadow: 0 .2rem 0.2rem var(--medium-gray);
    padding: 0 1rem 0 1rem;
    font-size: 1.5rem;
  }

  & .leads-table.advanced-search th {
    top: 50rem;
  }

  & .leads-table th button {
    display: block !important;
    width: 100% !important;
    height: 4rem !important;
    cursor: pointer;
  }

  & .leads-table th button: hover {
    background-color: var(--medium-gray);
  }

  & .leads-table thead {
    z-index: 100;
  }

  & .leads-table thead tr {
    height: 4rem;
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

  button {
    outline: none;
  }
`;
