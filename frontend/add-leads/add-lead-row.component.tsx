import React from "react";
import Modal from "../util/modal.component";
import IntakeServicesInputs from "../util/services-inputs.component";
import ReferralInputs, { ReferralInputRef } from "./referral-inputs.component";

export default function LeadRow({
  lead,
  deleteLead,
  updateLead,
  canDelete,
  isLastLead,
  isFirstLead,
  services,
  partners,
}) {
  const required = isFirstLead || !isLastLead;
  const [showInterests, setShowInterests] = React.useState(false);
  const intakeServicesInputsRef = React.useRef(null);
  const [showReferrals, setShowReferrals] = React.useState(false);
  const referralInputs = React.useRef<ReferralInputRef>();

  const input = (field, label, fieldRequired: boolean = required) => (
    <input
      style={{ width: "100%" }}
      value={lead[field] || ""}
      onChange={(e) => updateLead(field, e.target.value)}
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
            onChange={(evt) => updateLead("gender", evt.target.value)}
          >
            <option value="unknown">Unknown</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="other">Other</option>
          </select>
        </td>
        <td>
          <button
            className="secondary"
            type="button"
            onClick={() => setShowInterests(true)}
            style={{ display: "block", margin: "0 auto" }}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            className="secondary"
            type="button"
            onClick={() => setShowReferrals(true)}
            style={{ display: "block", margin: "0 auto" }}
          >
            Edit
          </button>
        </td>
        <td>
          <input
            type="checkbox"
            checked={Boolean(lead.smsConsent)}
            onChange={(evt) => updateLead("smsConsent", evt.target.checked)}
          />
        </td>
        <td>
          {canDelete && (
            <div role="button" tabIndex={0} onClick={deleteLead}>
              {"\u24E7"}
            </div>
          )}
        </td>
      </tr>
      {showInterests && (
        <Modal
          headerText="What services are they interested in?"
          close={closeInterests}
          primaryAction={updateInterests}
          primaryText="Update interests"
          secondaryAction={closeInterests}
          secondaryText="Cancel"
        >
          <IntakeServicesInputs
            ref={intakeServicesInputsRef}
            services={services}
            checkedServices={lead.leadServices}
          />
        </Modal>
      )}
      {showReferrals && (
        <Modal
          headerText="Lead Referrals"
          close={closeReferrals}
          primaryAction={updateReferrals}
          primaryText="Update referrals"
          secondaryAction={closeReferrals}
          secondaryText="Cancel"
          primarySubmit
        >
          <ReferralInputs
            referrals={lead.referrals || []}
            partners={partners}
            ref={referralInputs}
          />
        </Modal>
      )}
    </>
  );

  function closeInterests() {
    setShowInterests(false);
  }

  function closeReferrals() {
    setShowReferrals(false);
  }

  function updateReferrals(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    updateLead("referrals", referralInputs.current.getReferrals());
    closeReferrals();
  }

  function updateInterests() {
    updateLead("leadServices", intakeServicesInputsRef.current.checkedServices);
    closeInterests();
  }
}
