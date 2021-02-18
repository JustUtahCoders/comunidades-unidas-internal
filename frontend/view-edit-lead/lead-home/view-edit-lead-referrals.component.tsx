import dayjs from "dayjs";
import { useCss } from "kremling";
import React from "react";
import ReferralInputs, {
  ReferralInputRef,
} from "../../add-leads/referral-inputs.component";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";
import css from "./view-edit-lead-referrals.css";
import { formatPhone } from "../../util/formatters";

export default function ViewEditLeadReferrals(
  props: ViewEditLeadReferralsProps
) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [referrals, setReferrals] = React.useState([]);
  const [partners, setPartners] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [fetchingReferrals, setFetchingReferrals] = React.useState(true);
  const referralsInputRef = React.useRef<ReferralInputRef>();

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/partners`, { signal: ac.signal })
      .then(setPartners)
      .catch(handlePromiseError);

    return () => ac.abort();
  }, []);

  React.useEffect(() => {
    if (fetchingReferrals) {
      const ac = new AbortController();
      easyFetch(`/api/leads/${props.lead.id}/referrals`, { signal: ac.signal })
        .then(setReferrals)
        .catch(handlePromiseError)
        .finally(() => setFetchingReferrals(false));

      return () => ac.abort();
    }
  }, [fetchingReferrals]);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();

      Promise.all(
        referralsInputRef.current.getReferrals().map((referral) => {
          return easyFetch(`/api/leads/${props.lead.id}/referrals`, {
            signal: ac.signal,
            method: "POST",
            body: referral,
          });
        })
      )
        .then(() => {
          setFetchingReferrals(true);
        })
        .catch(handlePromiseError)
        .finally(() => {
          setIsSaving(false);
          setIsAdding(false);
        });

      return () => ac.abort();
    }
  }, [isSaving]);

  return (
    <LeadSection title={isAdding ? "Add Referrals" : "Referrals"}>
      <div {...useCss(css)}>{isAdding ? addReferrals() : showReferrals()}</div>
    </LeadSection>
  );

  function showReferrals() {
    let referralContent;
    if (referrals.length > 0) {
      referralContent = (
        <table className="referrals-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral, i) => (
              <tr key={i}>
                <td>{referral.partnerName}</td>
                <td>{formatPhone(referral.partnerPhone)}</td>
                <td>{referral.partnerServiceName}</td>
                <td>{dayjs(referral.referralDate).format("MMM D, YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      referralContent = <p>No referrals yet</p>;
    }

    return (
      <>
        {referralContent}
        <div className="view-actions">
          <button
            className="secondary edit-button"
            onClick={() => setIsAdding(true)}
            style={{ marginTop: "1.6rem" }}
          >
            Add Referrals
          </button>
        </div>
      </>
    );
  }

  function addReferrals() {
    return (
      <form onSubmit={handleAddSubmit}>
        <ReferralInputs
          partners={partners}
          referrals={[]}
          ref={referralsInputRef}
        />
        <div
          className="actions"
          style={{
            margin: "2.4rem 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="secondary"
            onClick={() => setIsAdding(false)}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="primary" disabled={isSaving}>
            Update
          </button>
        </div>
      </form>
    );
  }

  function handleAddSubmit(evt) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type ViewEditLeadReferralsProps = {
  lead: SingleLead;
};
