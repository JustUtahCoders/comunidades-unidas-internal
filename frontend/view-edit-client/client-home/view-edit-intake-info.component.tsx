import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient, AuditSummary } from "../view-client.component";
import dateformat from "dateformat";
import ClientSourceInputsComponent, {
  clientSources
} from "../../add-client/form-inputs/client-source-inputs.component";
import IntakeDateInput from "../../add-client/form-inputs/intake-date-input.component";
import easyFetch from "../../util/easy-fetch";
import IntakeServicesInputs from "../../util/services-inputs.component";
import checkedUrl from "../../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../../icons/148705-essential-collection/svg/close.svg";
import { useCss } from "kremling";

export default function ViewEditIntakeInfo(props: ViewEditIntakeInfoProps) {
  const { client } = props;
  const [editing, setEditing] = React.useState(false);
  const intakeDateInputRef = React.useRef(null);
  const clientSourceRef = React.useRef(null);
  const [apiStatus, dispatchApiStatus] = React.useReducer(apiStatusReducer, {
    isUpdating: false,
    newClientData: null
  });
  const [services, setServices] = React.useState([]);
  const intakeServicesRef = React.useRef(null);
  const scope = useCss(css);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/services", { signal: abortController.signal }).then(data =>
      setServices(data.services)
    );

    return () => abortController.abort();
  }, []);

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();

      easyFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: apiStatus.newClientData,
        signal: abortController.signal
      })
        .then(data => {
          props.clientUpdated(data.client);
        })
        .finally(() => {
          setEditing(false);
          dispatchApiStatus({ type: "reset" });
        });

      return () => abortController.abort();
    }
  }, [apiStatus.isUpdating]);

  return (
    <ClientSection
      title="Intake Information"
      auditSection={props.auditSummary && props.auditSummary.intakeData}
    >
      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <IntakeDateInput
            ref={intakeDateInputRef}
            date={client.dateOfIntake}
          />
          <ClientSourceInputsComponent
            ref={clientSourceRef}
            client={{
              clientSource: client.clientSource,
              couldVolunteer: client.couldVolunteer
            }}
          />
          <div>
            <label className="intake-services-label">
              <span className="intake-services-span">Intake Services</span>
              <IntakeServicesInputs
                ref={intakeServicesRef}
                services={services}
                checkedServices={client.intakeServices}
              />
            </label>
          </div>
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
        </form>
      ) : (
        <>
          <table className="client-table" {...scope}>
            <tbody>
              <tr>
                <td>Intake Date:</td>
                <td>{dateformat(client.dateOfIntake, "m/d/yyyy")}</td>
              </tr>
              <tr>
                <td>Client source:</td>
                <td>
                  {clientSources[client.clientSource] || client.clientSource}
                </td>
              </tr>
              <tr>
                <td>Could volunteer:</td>
                <td>{couldVolunteer()}</td>
              </tr>
              <tr>
                <td>Services interested in:</td>
                <td>
                  {client.intakeServices.length === 0
                    ? "(None)"
                    : client.intakeServices
                        .map(service => service.serviceName)
                        .join(", ")}
                </td>
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
    </ClientSection>
  );

  function handleEditSubmit(evt) {
    evt.preventDefault();
    const newClientData = {
      dateOfIntake: intakeDateInputRef.current.value,
      couldVolunteer: clientSourceRef.current.couldVolunteer,
      clientSource: clientSourceRef.current.clientSource,
      intakeServices: intakeServicesRef.current.checkedServices.map(
        service => service.id
      )
    };
    dispatchApiStatus({
      type: "do-patch",
      newClientData
    });
  }

  function couldVolunteer() {
    if (client.couldVolunteer) {
      return (
        <div className="could-volunteer">
          Yes{" "}
          <img
            src={checkedUrl}
            alt="Could volunteer for CU"
            title="Could volunteer for CU"
            className="could-volunteer-icon"
          />
        </div>
      );
    } else {
      return (
        <div className="could-volunteer">
          No{" "}
          <img
            src={closeUrl}
            alt="Could not volunteer for CU"
            title="Could not volunteer for CU"
            className="could-volunteer-icon"
          />
        </div>
      );
    }
  }
}

const css = `
& .could-volunteer {
  display: flex;
  align-items: center;
}

& .could-volunteer-icon {
  width: 1.6rem;
  margin-left: .8rem;
}

& .intake - services - label {
  display: flex;
  flex - direction: column;
}

& .intake - services - span {
  margin - top: 2rem;
  width: 100 %;
  font - size: 2.2rem;
  font - weight: 600;
  text - align: center;
}
`;

ViewEditIntakeInfo.defaultProps = {
  editable: true
};

function apiStatusReducer(state, action) {
  switch (action.type) {
    case "reset":
      return { isUpdating: false };
    case "do-patch":
      return { isUpdating: true, newClientData: action.newClientData };
    default:
      throw Error();
  }
}

type ViewEditIntakeInfoProps = {
  client: SingleClient;
  clientUpdated?(client: SingleClient): void;
  auditSummary?: AuditSummary;
  editable?: boolean;
};
