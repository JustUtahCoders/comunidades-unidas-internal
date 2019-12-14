import React from "react";
import dateformat from "dateformat";
import { Link } from "@reach/router";
import { useCss } from "kremling";
import { formatPhone } from "../../util/formatters";
import {
  LeadsTableProps,
  leadStatusColor,
  determineLeadStatus
} from "./leads-table.component";

export default function MobileLeadsTable(props: LeadsTableProps) {
  const scope = useCss(css);

  return (
    <div className="mobile-leads-table-container" {...scope}>
      {props.leads.map(lead => {
        return (
          <Link
            to={`/leads/${lead.id}`}
            className="unstyled lead-link"
            key={lead.id}
          >
            <div className="card mobile-lead-table-card">
              <h2>{`#${lead.id} - ${lead.fullName}`}</h2>
              <table className="leads-info-table-mobile">
                <tbody>
                  <tr>
                    <td>Phone:</td>
                    <td>{formatPhone(lead.phone) || ""}</td>
                  </tr>
                  <tr>
                    <td>ZIP:</td>
                    <td>{lead.zip || ""}</td>
                  </tr>
                  <tr>
                    <td>Age:</td>
                    <td>{lead.age || ""}</td>
                  </tr>
                  <tr>
                    <td>Event:</td>
                    <td>
                      {
                        lead.eventSources[lead.eventSources.length - 1]
                          .eventName
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Signup Date:</td>
                    <td>{dateformat(lead.dateOfSignUp, "m/d/yyyy")}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td style={leadStatusColor(lead.leadStatus)}>
                      {determineLeadStatus(
                        lead.leadStatus,
                        lead.id,
                        lead.contactStage,
                        lead.inactivityReason
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Services:</td>
                    <td>
                      <ul>
                        {lead.leadServices.map(service => {
                          return (
                            <li key={service.id}>{service.serviceName}</li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Link>
        );
      })}
      {props.fetchingLeads && <div className="loading-overlay" />}
    </div>
  );
}

const css = `
	& .mobile-lead-table-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	& .lead-link {
		display: block;
		margin-top: 3.2rem;
	}

	& .lead-link:last-child {
		margin: 3.2rem 0 3.2rem 0;
	}

	& .lead-link > h2 {
		font-size: 1rem;
	}

	& .mobile-lead-table-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-contents: center;
	}

	& .leads-info-table-mobile td:first-child {
		text-align: right;
		padding-right: 2.4rem;
		width: 30%;
		max-width: 30%;
	}

	& .leads-info-table-mobile td {
		padding: 0.4rem;
	}

	& .loading-overlay {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: var(--light-gray);
		z-index: 100;
		opacity: 0.6;
	}
`;
