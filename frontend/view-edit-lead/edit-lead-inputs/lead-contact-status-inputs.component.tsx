import React from "react";
import dateformat from "dateformat";
import { useCss } from "kremling";
import DateInput from "../../util/date-input.component";
import ContactAttemptInput from "./contact-attempt-input.component";

export default function LeadContactStatusInputs(
  props: LeadContactStatusInputsProps
) {
  const dateInputRef = React.useRef(null);
  const [dateOfSignUp, setDateOfSignUp] = React.useState(
    props.lead.dateOfSignUp || ""
  );
  const [leadStatus, setLeadStatus] = React.useState(
    props.lead.leadStatus || null
  );
  const [firstContactAttempt, setFirstContactAttempt] = React.useState(
    props.lead.contactStage.first || null
  );
  const [secondContactAttempt, setSecondContactAttempt] = React.useState(
    props.lead.contactStage.second || null
  );
  const [thirdContactAttempt, setThirdContactAttempt] = React.useState(
    props.lead.contactStage.third || null
  );
  const [inactivityReason, setInactivityReason] = React.useState(
    props.lead.inactivityReason || ""
  );
  const [errMsg, setErrMsg] = React.useState("");

  const scope = useCss(css);

  const now = new Date();

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="edit-form contact-status-form"
      {...scope}
    >
      <DateInput
        ref={dateInputRef}
        date={dateOfSignUp}
        labelName="Date of sign-up:"
      />
      <div>
        <label>
          <span>Status:</span>
          <select
            value={leadStatus}
            onChange={evt => setLeadStatus(evt.target.value)}
            required
          >
            <option value="">Select a status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="convertedToClient" disabled>
              Converted to client
            </option>
          </select>
        </label>
      </div>
      {leadStatus === "inactive" && (
        <div>
          <label>
            <span>Inactivity reason</span>
            <select
              value={inactivityReason}
              onChange={evt => setInactivityReason(evt.target.value)}
              required
            >
              <option value="">Select an inactivity reason</option>
              <option value="doNotCallRequest">Do not call request</option>
              <option value="threeAttemptsNoResponse">
                No response after third attempt
              </option>
              <option value="wrongNumber">Wrong number</option>
              <option value="noLongerInterested">No longer interested</option>
              <option value="relocated">No longer in Utah</option>
            </select>
          </label>
        </div>
      )}
      {firstContactAttempt ? (
        <table className="attempt-table">
          <tbody>
            {firstContactAttempt && (
              <ContactAttemptInput
                contactAttempt={firstContactAttempt}
                setContactAttempt={setFirstContactAttempt}
                rowName="First attempt"
              />
            )}
            {secondContactAttempt && (
              <ContactAttemptInput
                contactAttempt={secondContactAttempt}
                setContactAttempt={setSecondContactAttempt}
                rowName="Second attempt"
              />
            )}
            {thirdContactAttempt && (
              <ContactAttemptInput
                contactAttempt={thirdContactAttempt}
                setContactAttempt={setThirdContactAttempt}
                rowName="Third attempt"
              />
            )}
          </tbody>
        </table>
      ) : (
        <p className="no-contact-attempt">No contact attempt has been made</p>
      )}
      <div className="attempts">
        <button className="primary" onClick={evt => addContactAttempt(evt)}>
          Add Contact Attempt
        </button>
        {errMsg && <p className="error-message">{errMsg}</p>}
      </div>
      <div className="children-container">{props.children}</div>
    </form>
  );

  function handleSubmit(evt) {
    evt.preventDefault();

    const lead = {
      dateOfSignUp: dateInputRef.current.value,
      leadStatus: leadStatus,
      contactStage: {
        first:
          firstContactAttempt !== null
            ? new Date(firstContactAttempt).toISOString()
            : null,
        second:
          secondContactAttempt !== null
            ? new Date(secondContactAttempt).toISOString()
            : null,
        third:
          thirdContactAttempt !== null
            ? new Date(thirdContactAttempt).toISOString()
            : null
      },
      inactivityReason: inactivityReason
    };

    if (!lead.leadStatus) {
      // https://github.com/JustUtahCoders/comunidades-unidas-internal/issues/478
      // https://github.com/JustUtahCoders/comunidades-unidas-internal/issues/479
      delete lead.leadStatus;
    }

    return props.handleSubmit(evt, lead);
  }

  function addContactAttempt(evt) {
    evt.preventDefault();
    if (!thirdContactAttempt && secondContactAttempt && firstContactAttempt) {
      setThirdContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
      if (leadStatus === "active") {
        setLeadStatus("inactive");
      }
      if (!inactivityReason) {
        setInactivityReason("threeAttemptsNoResponse");
      }
    } else if (!secondContactAttempt && firstContactAttempt) {
      setSecondContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
    } else if (!firstContactAttempt) {
      setFirstContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
    } else {
      setErrMsg("Three contact attempts have already been made.");
    }
  }
}

const css = `
  & .contact-status-form {
    width: 85%;
  }

  & .no-contact-attempt {
    text-align: center;
    font-style: italic;
  }

  & .attempts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  & .attempt-table {
    border: var(--light-gray) solid 2px;
    background-color: var(--very-light-gray);
    width: 100%;
    text-align: center;
    margin: 1rem 0 1rem 0;
  }

  & .attempt-table td {
    padding: 1rem;
  }

  & .error-message {
    color: red;
    font-style: italic;
    text-align: center;
  }
`;

type LeadContactStatusInputsProps = {
  lead: LeadContactStatusInfo;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: LeadContactStatusInfo);
};

type LeadContactStatusInfo = {
  dateOfSignUp?: string;
  leadStatus?: string;
  contactStage?: ContactStageInfo;
  inactivityReason?: string;
};

type ContactStageInfo = {
  first?: string;
  second?: string;
  third?: string;
};
