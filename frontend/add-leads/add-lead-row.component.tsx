import React from "react";
import Modal from "../util/modal.component";
import IntakeServicesInputs from "../util/services-inputs.component";
import { ProgressPlugin } from "webpack";

export default function LeadRow({
  lead,
  deleteLead,
  updateLead,
  canDelete,
  isLastLead,
  isFirstLead,
  services
}) {
  const required = isFirstLead || !isLastLead;
  const [showInterests, setShowInterests] = React.useState(false);
  const intakeServicesInputsRef = React.useRef(null);

  const input = (field, label, fieldRequired: boolean = required) => (
    <input
      style={{ width: "100%" }}
      value={lead[field] || ""}
      onChange={e => updateLead(field, e.target.value)}
      aria-label={label}
      required={fieldRequired}
    />
  );

  return (
    <>
      <tr>
        <td>{input("firstName", "First")}</td>
        <td>{input("lastName", "Last")}</td>
        <td>{input("phone", "Phone")}</td>
        <td>{input("zip", "Zip", false)}</td>
        <td>{input("age", "Age", false)}</td>
        <td>
          <select
            style={{ width: "100%" }}
            required={required}
            value={lead.gender || "unknown"}
            onChange={evt => updateLead("gender", evt.target.value)}
          >
            <option value="unknown">Unknown</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="transgender">Transgender</option>
            <option value="other">Other</option>
          </select>
        </td>
        <td>
          <button
            className="secondary"
            type="button"
            onClick={() => setShowInterests(true)}
          >
            Edit
          </button>
        </td>
        <td>
          <input
            type="checkbox"
            checked={Boolean(lead.smsConsent)}
            onChange={evt => updateLead("smsConsent", evt.target.checked)}
          />
        </td>
        <td>{canDelete && <button onClick={deleteLead}>x</button>}</td>
      </tr>
      {showInterests && (
        <Modal
          headerText="What services are they interested in?"
          close={closeModal}
          primaryAction={updateInterests}
          primaryText="Update interests"
          secondaryAction={closeModal}
          secondaryText="Cancel"
        >
          <IntakeServicesInputs
            ref={intakeServicesInputsRef}
            services={services}
            checkedServices={lead.leadServices}
          />
        </Modal>
      )}
    </>
  );

  function closeModal() {
    setShowInterests(false);
  }

  function updateInterests() {
    updateLead("leadServices", intakeServicesInputsRef.current.checkedServices);
    closeModal();
  }
}
