import React from "react";
import easyFetch from "../../util/easy-fetch";
import { SingleLead } from "../view-lead.component";
import { formatPhone } from "../../util/formatters";
import LeadSection from "./lead-section.component";
import LeadContactInformationInputs from "../edit-lead-inputs/lead-contact-information-inputs.component";

export default function ViewEditLeadContactInfo(
  props: ViewEditLeadContactInfoProps
) {
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    isEditing: false,
    newLeadData: null
  });
  const { lead } = props;

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
          props.leadUpdated(data.lead);
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
    <LeadSection
      title={apiStatus.isEditing ? "Edit Contact Info" : "Contact Info"}
    >
      {apiStatus.isEditing ? (
        <LeadContactInformationInputs
          lead={{
            phone: lead.phone,
            smsConsent: lead.smsConsent,
            zip: lead.zip
          }}
          handleSubmit={handleSubmit}
        >
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => apiStatus.isEditing}
              disabled={apiStatus.isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={apiStatus.isUpdating}
            >
              Update
            </button>
          </div>
        </LeadContactInformationInputs>
      ) : (
        <>
          <table className="lead-table">
            <tbody>
              <tr>
                <td>Phone:</td>
                <td>{formatPhone(lead.phone)}</td>
              </tr>
              <tr>
                <td>SMS Consent:</td>
                <td>{lead.smsConsent === true ? "yes" : "no"}</td>
              </tr>
              <tr>
                <td>Zip:</td>
                <td>{lead.zip}</td>
              </tr>
            </tbody>
          </table>
          {props.editable && (
            <button
              className="secondary edit-button"
              onClick={() => dispatchApiStatus({ type: "edit" })}
            >
              Edit
            </button>
          )}
        </>
      )}
    </LeadSection>
  );

  function handleSubmit(evt, newLeadData) {
    evt.preventDefault();
    dispatchApiStatus({ type: "update", newLeadData });
  }
}

ViewEditLeadContactInfo.defaultProps = {
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

type ViewEditLeadContactInfoProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
