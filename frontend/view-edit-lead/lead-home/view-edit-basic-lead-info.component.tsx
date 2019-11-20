import React from "react";
import easyFetch from "../../util/easy-fetch";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import BasicLeadInformationInputs from "../edit-lead-inputs/basic-lead-information-inputs.component";

export default function ViewEditBasicLeadInfo(
  props: ViewEditBasicLeadInfoProps
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
      title={editing ? "Edit Basic Information" : "Basic information"}
    >
      {editing ? (
        <BasicLeadInformationInputs
          lead={{
            firstName: lead.firstName,
            lastName: lead.lastName,
            gender: lead.gender,
            age: lead.age
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
        </BasicLeadInformationInputs>
      ) : (
        <>
          <table className="lead-table">
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{lead.fullName}</td>
              </tr>
              <tr>
                <td>Age:</td>
                <td>{lead.age}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{lead.gender}</td>
              </tr>
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

ViewEditBasicLeadInfo.defaultProps = {
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

type ViewEditBasicLeadInfoProps = {
  lead: SingleLead;
  leadUpdated?(lead: SingleLead): void;
  editable?: boolean;
};
