import React from "react";
import easyFetch from "../../util/easy-fetch";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import LeadServicesInformationInputs from "../edit-lead-inputs/lead-services-inputs.component";

export default function ViewEditLeadServicesInfo(
  props: ViewEditLeadServicesInfoProps
) {
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isEditing: false,
    isUpdating: false,
    newLeadData: null,
  });
  const { lead, leadUpdated } = props;

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        body: apiStatus.newLeadData,
        signal: abortController.signal,
      })
        .then((data) => {
          leadUpdated(data.lead);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          dispatchApiStatus({ type: "reset" });
        });

      return () => abortController.abort();
    }
  }, [apiStatus]);

  return (
    <LeadSection
      title={
        apiStatus.isEditing
          ? "Edit Services of Interest"
          : "Services of Interest"
      }
    >
      {apiStatus.isEditing ? (
        <LeadServicesInformationInputs
          lead={{
            leadServices: lead.leadServices,
          }}
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
        </LeadServicesInformationInputs>
      ) : (
        <>
          {lead.leadServices.length > 0 ? (
            <table className="lead-service-table">
              <thead>
                <tr>
                  <th>Name of Service</th>
                  <th>Program</th>
                </tr>
              </thead>
              <tbody>
                {lead.leadServices.map((service) => {
                  return (
                    <tr key={service.id}>
                      <td align="left">{service.serviceName}</td>
                      <td align="center">{service.programName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No services have been selected</p>
          )}
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

ViewEditLeadServicesInfo.defaultProps = {
  editable: true,
};

function updatingReducer(state, action) {
  switch (action.type) {
    case "edit":
      return { isEditing: true };
    case "update":
      return {
        isEditing: false,
        isUpdating: true,
        newLeadData: action.newLeadData,
      };
    case "reset":
      return { isEditing: false, isUpdating: false };
    default:
      throw Error();
  }
}

type ViewEditLeadServicesInfoProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
