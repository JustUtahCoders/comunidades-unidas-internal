import React from "react";
import { SingleClient, AuditSummary } from "../view-client.component";
import { useCss } from "kremling";
import enabledImgUrl from "../../../icons/148705-essential-collection/svg/success.svg";
import disabledImgUrl from "../../../icons/148705-essential-collection/svg/error.svg";
import JuntosPorLaSalud from "./juntos-por-la-salud.component";
import { any } from "prop-types";

const EditComps = {
  "Juntos Por La Salud": JuntosPorLaSalud
};

export default function Integrations(props: IntegrationsProps) {
  const scope = useCss(css);
  const [integrations, setIntegrations] = React.useState<Integration[]>([]);
  const [integrationToEdit, setIntegrationToEdit] = React.useState<Integration>(
    null
  );

  React.useEffect(() => {
    // TO-DO call API
    setIntegrations([
      {
        name: "Juntos Por La Salud",
        status: IntegrationStatus.disabled,
        externalId: null
      }
    ]);
  }, [props.clientId]);

  return (
    <div className="card" {...scope}>
      <h2 className="header">Integrations</h2>
      <p>Integrations connect CU Database with other software systems.</p>
      {integrations.map(integration => (
        <React.Fragment key={integration.name}>
          <h3 className="header">{integration.name}</h3>
          {props.client && (
            <p className="status">
              <img
                className="status-img"
                src={
                  integration.status === IntegrationStatus.enabled
                    ? enabledImgUrl
                    : disabledImgUrl
                }
                alt="Enabled status icon"
                title={
                  integration.status === IntegrationStatus.enabled
                    ? "Enabled"
                    : "Disabled"
                }
              />
              Integration{" "}
              {integration.status === IntegrationStatus.enabled ? "ON" : "OFF"}
            </p>
          )}
          <button
            type="button"
            className="primary"
            onClick={() => setIntegrationToEdit(integration)}
          >
            Change
          </button>
        </React.Fragment>
      ))}
      {integrationToEdit && renderEditModal()}
    </div>
  );

  function renderEditModal() {
    const EditComp = EditComps[integrationToEdit.name];

    if (!EditComp) {
      throw Error(
        `No edit integration component has been implemented for integration '${integrationToEdit.name}'`
      );
    }

    return (
      <EditComp
        close={closeEditModal}
        integration={integrationToEdit}
        client={props.client}
        updateIntegration={updateIntegration}
      />
    );
  }

  function updateIntegration(newIntegration) {
    setIntegrationToEdit(null);
    setIntegrations(
      integrations.map(i =>
        i.name === newIntegration.name ? newIntegration : i
      )
    );
  }

  function closeEditModal() {
    setIntegrationToEdit(null);
  }
}

const css = `
& .header {
  margin: 0;
}

& .checkbox {
  height: 1.6rem;
}

.status {
  display: flex;
  align-items: center;
}

& .status-img {
  height: 2.4rem;
  margin-right: .8rem;
}
`;

type IntegrationsProps = {
  path: string;
  clientId: string;
  client: SingleClient;
  setClient: (client: SingleClient) => any;
  auditSummary: AuditSummary;
  refetchClient: () => any;
};

type Integration = {
  name: string;
  status: IntegrationStatus;
  externalId: string | null;
};

export enum IntegrationStatus {
  enabled = "enabled",
  disabled = "disabled"
}

export type EditIntegrationProps = {
  integration: Integration;
  close: () => any;
  client: SingleClient;
  updateIntegration: (integration: Integration) => any;
};
