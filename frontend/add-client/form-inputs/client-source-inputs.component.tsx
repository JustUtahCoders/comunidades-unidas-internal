import React, { useState } from "react";
import { useCss } from "kremling";
import { ClientSources } from "../add-client.component";
import { IntakeQuestion } from "../../admin/intake/intake-setting.component";
import { renderDynamicallyOrderedQuestions } from "./dynamic-question-helpers";
import { ClientIntakeSettings } from "../../admin/intake/client-intake-settings.component";

export default React.forwardRef<ClientSourceRef, ClientSourceInputsProps>(
  function ClientSourceInputs(props: ClientSourceInputsProps, ref) {
    const [clientSource, setClientSource] = useState(
      ClientSources[
        props.client.clientSource || (props.isNewClient ? "friend" : "unknown")
      ]
    );
    const [couldVolunteer, setCouldVolunteer] = useState(
      props.client.couldVolunteer || false
    );
    const scope = useCss(css);

    React.useEffect(() => {
      if (ref) {
        // @ts-ignore
        ref.current = {
          clientSource: clientSource === "unknown" ? null : clientSource,
          couldVolunteer,
        };
      }
    });

    const questionRenderers = {
      clientSource: renderClientSource,
      couldVolunteer: renderCouldVolunteer,
    };

    return (
      <div {...scope}>
        {renderDynamicallyOrderedQuestions(
          props.clientIntakeSettings.intakeInfo,
          questionRenderers,
          ["dateOfIntake", "intakeServices"]
        )}
      </div>
    );

    function renderClientSource(question: IntakeQuestion) {
      return (
        <div>
          <label>
            <span className="intake-span">{question.label}</span>
            <select
              value={clientSource || "unknown"}
              onChange={(evt) => setClientSource(evt.target.value)}
              autoFocus
              required={question.required}
              placeholder={question.placeholder}
            >
              {Object.keys(clientSources).map((clientSource) => (
                <option key={clientSource} value={clientSource}>
                  {clientSources[clientSource]}
                </option>
              ))}
            </select>
          </label>
        </div>
      );
    }

    function renderCouldVolunteer(question: IntakeQuestion) {
      return (
        <div>
          <label>
            <span className="intake-span">{question.label}</span>
            <input
              type="checkbox"
              name="couldVolunteer"
              checked={couldVolunteer}
              onChange={(evt) => setCouldVolunteer(Boolean(evt.target.checked))}
            />
          </label>
        </div>
      );
    }
  }
);

const css = `
& .intake-span {
  width: 50%;
}
`;

export const clientSources = {
  unknown: "Unknown",
  facebook: "Facebook",
  instagram: "Instagram",
  website: "Website",
  promotionalMaterial: "Promotional Material",
  consulate: "Consulate",
  friend: "Friend",
  previousClient: "C.U. Client",
  employee: "C.U. Employee",
  sms: "Text Message",
  radio: "Radio",
  tv: "TV",
  promotora: "Promotora",
  other: "Other",
};

type ClientSourceInputsProps = {
  client: ClientSourceInputClient;
  isNewClient: boolean;
  clientIntakeSettings: ClientIntakeSettings;
};

type ClientSourceInputClient = {
  clientSource?: string;
  couldVolunteer?: boolean;
};

type ClientSourceRef = {
  clientSource: string;
  couldVolunteer: boolean;
};
