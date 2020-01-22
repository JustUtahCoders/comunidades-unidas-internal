import React from "react";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import LeadEventsInformationInputs from "../edit-lead-inputs/lead-event-information-inputs.component";
import easyFetch from "../../util/easy-fetch";

export default function ViewEditLeadEventInfo(
  props: ViewEditLeadEventInfoProps
) {
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isEditing: false,
    isUpdating: false,
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
    <LeadSection
      title={
        apiStatus.isEditing ? "Edit Event Information" : "Event Information"
      }
    >
      {apiStatus.isEditing ? (
        <LeadEventsInformationInputs
          lead={{ eventSources: lead.eventSources.map(event => event.eventId) }}
          handleSubmit={handleSubmit}
        >
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => dispatchApiStatus({ type: "reset" })}
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
        </LeadEventsInformationInputs>
      ) : (
        <>
          {lead.eventSources.length === 0 &&
            "Lead has not attended any events to date"}
          {lead.eventSources.length === 1 && (
            <table className="lead-table">
              <tbody>
                <tr>
                  <td>Event Name:</td>
                  <td>{lead.eventSources[0].eventName}</td>
                </tr>
                <tr>
                  <td>Event Location:</td>
                  <td>{lead.eventSources[0].eventLocation}</td>
                </tr>
                <tr>
                  <td>Event Date:</td>
                  <td>{lead.eventSources[0].eventDate}</td>
                </tr>
              </tbody>
            </table>
          )}
          {lead.eventSources.length > 1 &&
            lead.eventSources.map((event, i) => {
              return (
                <table className="lead-table" key={event.eventId}>
                  <thead>
                    <tr>
                      <th colSpan={2}>Event #{i + 1}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Event Name:</td>
                      <td>{event.eventName}</td>
                    </tr>
                    <tr>
                      <td>Event Location:</td>
                      <td>{event.eventLocation}</td>
                    </tr>
                    <tr>
                      <td>Event Date:</td>
                      <td>{event.eventDate}</td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
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

ViewEditLeadEventInfo.defaultProps = {
  editable: true
};

function updatingReducer(state, action) {
  switch (action.type) {
    case "edit":
      return { isEditing: true };
    case "update":
      return {
        isEditing: false,
        isUpdating: true,
        newLeadData: action.newLeadData
      };
    case "reset":
      return { isEditing: false, isUpdating: false };
    default:
      throw Error();
  }
}

type ViewEditLeadEventInfoProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
