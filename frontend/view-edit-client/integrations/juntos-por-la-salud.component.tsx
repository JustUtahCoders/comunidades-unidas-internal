import React from "react";
import {
  EditIntegrationProps,
  IntegrationStatus,
  IntegrationPatchRequestBody
} from "./integrations.component";
import Modal from "../../util/modal.component";
import easyFetch from "../../util/easy-fetch";

export default function JuntosPorLaSalud(props: EditIntegrationProps) {
  const [createNewParticipant, setCreateNewParticipant] = React.useState(
    !Boolean(props.integration.externalId)
  );
  const [participantId, setParticipantId] = React.useState(
    props.integration.externalId || ""
  );
  const [modalStatus, setModalStatus] = React.useState<ModalStatus>();
  const submitRef = React.useRef<HTMLButtonElement>();

  React.useEffect(() => {
    if (
      modalStatus === ModalStatus.enabling ||
      modalStatus === ModalStatus.disabling
    ) {
      const abortController = new AbortController();
      const requestBody: IntegrationPatchRequestBody = {
        status:
          modalStatus === ModalStatus.enabling
            ? IntegrationStatus.enabled
            : IntegrationStatus.disabled
      };
      if (participantId) {
        requestBody.externalId = participantId.trim();
      }
      easyFetch(
        `/api/clients/${props.client.id}/integrations/${props.integration.id}`,
        {
          signal: abortController.signal,
          method: "PATCH",
          body: requestBody
        }
      )
        .then(props.updateIntegration)
        .catch(err => {
          setTimeout(() => {
            throw err;
          });
        });
      return () => abortController.abort();
    }
  }, [modalStatus, props.updateIntegration]);

  return (
    <Modal
      close={props.close}
      headerText={props.client ? props.client.fullName : "Client"}
      primaryText={primaryButtonText()}
      primaryAction={primaryAction}
    >
      {props.integration.status === IntegrationStatus.enabled
        ? renderDisablePrompt()
        : renderEnablePrompt()}
    </Modal>
  );

  function primaryButtonText() {
    console.log(
      "modalStatus",
      modalStatus,
      "props.integration.status",
      props.integration.status
    );
    if (modalStatus === "enabling") {
      return "Enabling...";
    } else if (modalStatus === "disabling") {
      return "Disabling...";
    } else if (
      props.integration.status === IntegrationStatus.disabled ||
      props.integration.status === IntegrationStatus.broken
    ) {
      return "Enable";
    } else {
      return "Disable";
    }
  }

  function renderEnablePrompt() {
    return (
      <form onSubmit={handleSubmit}>
        <h4 style={{ margin: 0 }}>Turn on Juntos Por La Salud Integration</h4>
        <p>
          Does {props.client.fullName} already exist in the Juntos Por La Salud
          portal (ventanilla)?
        </p>
        <div>
          <label>
            <input
              type="radio"
              checked={createNewParticipant}
              name="create-new-participant"
              value="new"
              onChange={() => setCreateNewParticipant(true)}
            />
            <span className="caption">No. Create a new participant.</span>
          </label>
        </div>
        <label>
          <input
            type="radio"
            checked={!createNewParticipant}
            name="create-new-participant"
            value="existing"
            onChange={() => setCreateNewParticipant(false)}
          />
          <span className="caption">Yes. Reuse existing participant</span>
        </label>
        {!createNewParticipant && (
          <>
            <p>
              What is the Participant ID in the Juntos Por La Salud website?
            </p>
            <label>
              <span className="caption" style={{ paddingRight: "1.6rem" }}>
                Participant ID:
              </span>
              <input
                type="text"
                value={participantId}
                onChange={evt => setParticipantId(evt.target.value)}
                required
              />
            </label>
          </>
        )}
        <button style={{ display: "none" }} ref={submitRef}></button>
      </form>
    );
  }

  function renderDisablePrompt() {
    return (
      <>
        <h4 style={{ margin: 0 }}>Turn off Juntos Por La Salud Integration</h4>
        <p className="medium-size">
          Disabling the Juntos Por La Salud integration will turn off all future
          updates to the JPLS portal (ventanilla). This does not delete any data
          from the Juntos Por La Salud database.
        </p>
        <p className="medium-size">
          Are you sure you'd like to turn off Juntos Por La Salud for{" "}
          {props.client.fullName}?
        </p>
      </>
    );
  }

  function primaryAction() {
    if (props.integration.status === IntegrationStatus.enabled) {
      setModalStatus(ModalStatus.disabling);
    } else {
      submitRef.current.click();
    }
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (props.integration.status === IntegrationStatus.enabled) {
      setModalStatus(ModalStatus.disabling);
    } else {
      setModalStatus(ModalStatus.enabling);
    }
  }
}

JuntosPorLaSalud.getExternalLink = externalId =>
  `https://ventanillasjpls.org/Registro/Persona.aspx?params=${btoa(
    `ViewMode=ReadOnly&PersonaID=${externalId}`
  )}`;

enum ModalStatus {
  prompting = "prompting",
  enabling = "enabling",
  disabling = "disabling"
}
