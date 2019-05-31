import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import dateformat from "dateformat";
import ClientSourceInputsComponent, {
  clientSources
} from "../add-client/form-inputs/client-source-inputs.component";
import { useCss } from "kremling";
import IntakeDateInput from "../add-client/form-inputs/intake-date-input.component";
import easyFetch from "../util/easy-fetch";
import IntakeServicesInputs from "../add-client/form-inputs/intake-services-inputs.component";

export default function ViewEditIntakeInfo(props: ViewEditIntakeInfoProps) {
  const { client } = props;
  const [editing, setEditing] = React.useState(false);
  const scope = useCss(css);
  const intakeDateInputRef = React.useRef(null);
  const clientSourceRef = React.useRef(null);
  const [apiStatus, dispatchApiStatus] = React.useReducer(apiStatusReducer, {
    isUpdating: false,
    newClientData: null
  });
  const [services, setServices] = React.useState([]);
  const intakeServicesRef = React.useRef(null);

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
    <ClientSection title="Intake Information">
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
            <label>
              <span>Intake Services</span>
              <IntakeServicesInputs
                ref={intakeServicesRef}
                services={services}
                checkedServices={client.intakeServices.map(
                  service => service.id
                )}
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
        <section className="view-edit-intake-info" {...scope}>
          <div>{dateformat(client.dateOfIntake, "m/d/yyyy")}</div>
          <div>{clientSources[client.clientSource] || client.clientSource}</div>
          <div>
            {client.couldVolunteer ? "Can volunteer" : "Can't volunteer"}
          </div>
          <div>
            {client.intakeServices
              .map(service => service.serviceName)
              .join(", ")}
          </div>
          <button
            className="secondary edit-button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </section>
      )}
    </ClientSection>
  );

  function handleEditSubmit(evt) {
    evt.preventDefault();
    const newClientData = {
      dateOfIntake: intakeDateInputRef.current.value,
      couldVolunteer: clientSourceRef.current.couldVolunteer,
      clientSource: clientSourceRef.current.clientSource,
      intakeServices: intakeServicesRef.current.checkedServices
    };
    dispatchApiStatus({
      type: "do-patch",
      newClientData
    });
  }
}

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
  clientUpdated(client: SingleClient): void;
};

const css = `
& .view-edit-intake-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
`;
