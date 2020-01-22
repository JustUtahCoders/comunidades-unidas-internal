import React from "react";
import dayjs from "dayjs";
import { Link } from "@reach/router";
import easyFetch from "../../util/easy-fetch";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import LeadContactStatusInputs from "../edit-lead-inputs/lead-contact-status-inputs.component";

export default function ViewEditLeadContactStatus(
  props: ViewEditLeadContactStatusProps
) {
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    isEditing: false,
    newLeadData: null
  });
  const { lead, leadUpdated } = props;

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        body: apiStatus.newLeadData,
        signal: abortController.signal
      })
        .then(data => {
          dispatchApiStatus({ type: "reset" });
          leadUpdated(data.lead);
        })
        .catch(err => {
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [apiStatus]);

  return (
    <LeadSection title="Contact Status">
      <table className="lead-table">
        <tbody>
          <tr>
            <td>Date of Sign Up:</td>
            <td>{lead.dateOfSignUp}</td>
          </tr>
          <tr>
            <td>Current Status:</td>
            {lead.leadStatus === "convertedToClient" ? (
              <td>
                Converted to Client (see client{" "}
                <Link to={`/clients/${lead.clientId}`}>#{lead.clientId}</Link>)
              </td>
            ) : (
              <td>{lead.leadStatus}</td>
            )}
          </tr>
          <tr>
            <td>First Contact Attempt:</td>
            <td>
              {lead.contactStage.first === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.first).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
          <tr>
            <td>Second Contact Attempt:</td>
            <td>
              {lead.contactStage.second === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.second).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
          <tr>
            <td>Third Contact Attempt:</td>
            <td>
              {lead.contactStage.third === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.third).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
        </tbody>
      </table>
    </LeadSection>
  );

  function handleSubmit(evt, newLeadData) {
    evt.preventDefault();
    dispatchApiStatus({ type: "update", newLeadData });
  }
}

ViewEditLeadContactStatus.defaultProps = {
  editable: true
};

function updatingReducer(state, action) {
  switch (action.type) {
    case "edit":
      return { isEditing: true };
    case "update":
      return {
        isUpdating: true,
        isEditing: false,
        newLeadData: action.newLeadData
      };
    case "reset":
      return { isUpdating: false };
    default:
      throw Error();
  }
}

type ViewEditLeadContactStatusProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
