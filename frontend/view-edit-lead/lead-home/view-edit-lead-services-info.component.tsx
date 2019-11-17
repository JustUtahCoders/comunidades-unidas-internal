import React from "react";
import easyFetch from "../../util/easy-fetch";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import LeadServicesInformationInputs from "../edit-lead-inputs/lead-services-inputs.component";

export default function ViewEditLeadServicesInfo(
  props: ViewEditLeadServicesInfoProps
) {
  const [editing, setEditing] = React.useState(false);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newLeadData: null
  });
  const { lead, leadUpdated } = props;

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/leads/${props.lead.id}`, {
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
        })
        .finally(() => {
          setEditing(false);
          dispatchApiStatus({ type: "reset" });
        });

      return () => abortController.abort();
    }
  }, [apiStatus]);

  return (
    <LeadSection
      title={editing ? "Edit Services of Interest" : "Services of Interest"}
    >
      {editing ? (
        <LeadServicesInformationInputs
          lead={{
            leadServices: lead.leadServices
          }}
          handleSubmit={handleSubmit}
        >
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(false)}
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
        </LeadServicesInformationInputs>
      ) : (
        <>
          <table className="lead-service-table">
            <thead>
              <tr>
                <th>Name of Service</th>
                <th>Program</th>
              </tr>
            </thead>
            <tbody>
              {lead.leadServices.map(service => {
                return (
                  <tr key={service.id}>
                    <td align="left">{service.serviceName}</td>
                    <td align="center">{service.programName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {props.editable && (
            <button
              className="secondary edit-button"
              onClick={() => setEditing(true)}
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

ViewEditLeadServicesInfo.defaultProps = {
  editable: true
};

function updatingReducer(state, action) {
  switch (action.type) {
    case "update":
      return { isUpdating: true, newLeadData: action.newLeadData };
    case "reset":
      return { isUpdating: false };
    default:
      throw Error();
  }
}

type ViewEditLeadServicesInfoProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
