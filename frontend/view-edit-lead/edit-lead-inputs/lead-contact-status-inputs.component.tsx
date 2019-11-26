import React from "react";
import dateformat from "dateformat";
import { useCss } from "kremling";
import DateInput from "../../util/date-input.component";
import ContactAttemptStatus from "./contact-attempt-input.component";

export default function LeadContactStatusInputs(
  props: LeadContactStatusInputsProps
) {
  const dateInputRef = React.useRef(null);
  const [leadStatus, setLeadStatus] = React.useState(
    props.lead.leadStatus || ""
  );
  const [firstContactAttempt, setFirstContactAttempt] = React.useState(
    props.lead.firstContactAttempt || ""
  );
  const [secondContactAttempt, setSecondContactAttempt] = React.useState(
    props.lead.secondContactAttempt || ""
  );
  const [thirdContactAttempt, setThirdContactAttempt] = React.useState(
    props.lead.thirdContactAttempt || ""
  );
  const [inactivityReason, setInactivityReason] = React.useState(
    props.lead.inactivityReason || ""
  );
  const [errMsg, setErrMsg] = React.useState("");

  const scope = useCss(css);

  const now = new Date();

  console.log("lead-contact-status");
  console.log("date of signup");
  console.log(props.lead.dateOfSignUp);

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="edit-form contact-status-form"
      {...scope}
    >
      <DateInput
        withTime={false}
        ref={dateInputRef}
        date={props.lead.dateOfSignUp}
        labelName="Date of sign-up"
      />
      <div>
        <label>
          <span>Status</span>
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
              <ContactAttemptStatus
                contactAttempt={firstContactAttempt}
                setContactAttempt={setFirstContactAttempt}
                rowName="First attempt"
              />
            )}
            {secondContactAttempt && (
              <ContactAttemptStatus
                contactAttempt={secondContactAttempt}
                setContactAttempt={setSecondContactAttempt}
                rowName="Second attempt"
              />
            )}
            {thirdContactAttempt && (
              <ContactAttemptStatus
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
    return props.handleSubmit(evt, {
      dateOfSignUp: dateInputRef.current.value,
      leadStatus: leadStatus,
      firstContactAttempt: firstContactAttempt,
      secondContactAttempt: secondContactAttempt,
      thirdContactAttempt: thirdContactAttempt,
      inactivityReason: inactivityReason
    });
  }

  function addContactAttempt(evt) {
    evt.preventDefault();
    if (!firstContactAttempt) {
      setFirstContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
    } else if (!secondContactAttempt) {
      setSecondContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
    } else if (!thirdContactAttempt) {
      setThirdContactAttempt(dateformat(now, "mm/dd/yyyy hh:MM TT"));
      if (leadStatus === "active") {
        setLeadStatus("inactive");
      }
      if (!inactivityReason) {
        setInactivityReason("threeAttemptsNoResponse");
      }
    } else {
      setErrMsg("Three contact attempts have already been made.");
    }
  }
}

const css = `
	& .contact-status-form {
		width: 75%;
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
  firstContactAttempt?: string;
  secondContactAttempt?: string;
  thirdContactAttempt?: string;
  inactivityReason?: string;
};
