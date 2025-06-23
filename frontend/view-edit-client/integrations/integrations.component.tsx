import React from "react";
import { SingleClient, AuditSummary } from "../view-client.component";
import { useCss } from "kremling";
import enabledImgUrl from "../../../icons/148705-essential-collection/svg/success.svg";
import disabledImgUrl from "../../../icons/148705-essential-collection/svg/minus.svg";
import brokenImgUrl from "../../../icons/148705-essential-collection/svg/error.svg";
import timeAgoImgUrl from "../../../icons/148705-essential-collection/svg/cloud-computing-3.svg";
import JuntosPorLaSalud from "./juntos-por-la-salud.component";
import { format } from "timeago.js";
import easyFetch from "../../util/easy-fetch";

const EditComps = {
  JPLS: JuntosPorLaSalud,
};

export default function Integrations(props: IntegrationsProps) {
  const scope = useCss(css);
  const [integrations, setIntegrations] = React.useState<Integration[]>([]);
  const [integrationToEdit, setIntegrationToEdit] =
    React.useState<Integration>(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/clients/${props.clientId}/integrations`, {
      signal: abortController.signal,
    })
      .then(setIntegrations)
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });
    return () => abortController.abort();
  }, [props.clientId]);

  return (
    <div className="card" {...scope}>
      <h2 className="header">Integrations</h2>
      <p>Integrations connect CU Database with other software systems.</p>
      {integrations.map((integration) => (
        <React.Fragment key={integration.name}>
          <h3 className="header">{integration.name}</h3>
          {props.client && (
            <div className="status">
              {getIntegrationStatusText(integration)}
              <div>
                <img
                  src={timeAgoImgUrl}
                  alt="Hourglass"
                  className="status-img"
                />
                Last sync:{" "}
                {integration.lastSync ? format(integration.lastSync) : "never"}
              </div>
              {integration.externalId && (
                <a
                  rel="noopener"
                  target="_blank"
                  href={getExternalIntegrationLink(integration)}
                >
                  View in {integration.name}
                </a>
              )}
            </div>
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
    const EditComp = EditComps[integrationToEdit.id];

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
      integrations.map((i) =>
        i.name === newIntegration.name ? newIntegration : i
      )
    );
  }

  function closeEditModal() {
    setIntegrationToEdit(null);
  }

  function getIntegrationStatusText(integration: Integration) {
    switch (integration.status) {
      case IntegrationStatus.enabled:
        return (
          <div>
            <img
              className="status-img"
              src={enabledImgUrl}
              alt="Enabled status icon"
              title="Integration enabled"
            />
            Status: enabled
          </div>
        );
      case IntegrationStatus.disabled:
        return (
          <div>
            <img
              className="status-img"
              src={disabledImgUrl}
              alt="Disabled status icon"
              title="Integration disabled"
            />
            Status: disabled
          </div>
        );
      case IntegrationStatus.broken:
        return (
          <div>
            <img
              className="status-img"
              src={brokenImgUrl}
              alt="Broken status icon"
              title="Integration broken"
            />
            Status: broken
          </div>
        );
      default:
        throw Error(
          `Unknown integration status '${integration.status}' for client ${props.clientId}`
        );
    }
  }
}

function getExternalIntegrationLink(integration) {
  const EditComp = EditComps[integration.id];

  if (!EditComp || !EditComp.getExternalLink) {
    throw Error(
      `External link not yet implemented for integration ${integration.id}`
    );
  }

  return EditComp.getExternalLink(integration.externalId);
}

const css = `
& .header {
  margin: 0;
}

& .checkbox {
  height: 1.6rem;
}

& .status {
  margin: 2.4rem 0;
}

.status > * {
  display: flex;
  align-items: center;
  margin-bottom: .8rem;
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
  id: string;
  name: string;
  status: IntegrationStatus;
  externalId: string | null;
  lastSync: Date | null;
};

export enum IntegrationStatus {
  enabled = "enabled",
  disabled = "disabled",
  broken = "broken",
}

export type EditIntegrationProps = {
  integration: Integration;
  close: () => any;
  client: SingleClient;
  updateIntegration: (integration: Integration) => any;
};

export type IntegrationPatchRequestBody = {
  status?: IntegrationStatus;
  externalId?: string;
};
