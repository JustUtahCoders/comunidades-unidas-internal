import React from "react";
import easyFetch from "../util/easy-fetch";
import { useCss, always } from "kremling";
import { Link, Router } from "@reach/router";
import PageHeader from "../page-header.component";
import StickySecondaryNav from "../navbar/sticky-secondary-nav.component";
import LeadHome from "./lead-home/lead-home.component";
import homeImgUrl from "../../icons/148705-essential-collection/svg/home.svg";
import leadToClientImgUrl from "../../icons/148705-essential-collection/svg/user-8.svg";

export default function ViewLead(props: ViewLeadProps) {
  const [lead, setLead] = React.useState<SingleLead>(null);
  const [error, setError] = React.useState(null);
  const [leadIsStale, setLeadIsStale] = React.useState(false);
  const leadId = props.leadId;
  const scope = useCss(css);

  React.useEffect(() => {
    return fetchLead(leadId, setLead, setError, setLeadIsStale);
  }, [leadId]);

  React.useEffect(() => {
    if (leadIsStale) {
      return fetchLead(leadId, setLead, setError, setLeadIsStale);
    }
  }, [leadIsStale]);

  const childProps = {
    lead,
    setLead,
    leadId,
    refetchLead: () => setLeadIsStale(true)
  };

  return (
    <div {...scope}>
      <PageHeader title={getHeaderTitle()} withSecondaryNav />
      <StickySecondaryNav>
        <div className="nav-container">
          <ul>
            <li>
              <Link to={`/leads/${leadId}`} getProps={getLinkProps}>
                <img
                  alt="Home icon"
                  className="nav-icon"
                  src={homeImgUrl}
                  title={possessiveLeadName() + " home"}
                />
              </Link>
            </li>
            <li>
              <Link to={`/add-client/lead/${leadId}`} getProps={getLinkProps}>
                <img
                  alt="convert to client icon"
                  className="nav-icon-bigger"
                  src={leadToClientImgUrl}
                  title={"Convert lead to client"}
                />
              </Link>
            </li>
          </ul>
        </div>
      </StickySecondaryNav>
      <Router>
        <LeadHome path="/" {...childProps} />
      </Router>
    </div>
  );

  function getHeaderTitle() {
    if (error && error.status === 404) {
      return `Could not find lead ${leadId}`;
    } else if (error && error.status === 400) {
      return `Invalid lead id '${leadId}'`;
    } else if (lead) {
      return `${lead.fullName} (#${lead.id})`;
    } else {
      return "Loading lead...";
    }
  }

  function getLinkProps({ isCurrent }) {
    return {
      className: always("secondary-nav-link").maybe("active", isCurrent)
    };
  }

  function possessiveLeadName() {
    if (lead) {
      return lead.firstName + (lead.firstName.endsWith("s") ? "'" : "'s");
    } else {
      return "Lead's";
    }
  }
}

export function fetchLead(leadId, setLead, setError, setLeadIsStale) {
  const abortController = new AbortController();

  easyFetch(`/api/leads/${leadId}`, { signal: abortController.signal })
    .then(data => {
      setLead(data.lead);
    })
    .catch(err => {
      console.error(err);
      setError(err);
    })
    .finally(() => {
      setLeadIsStale(false);
    });

  return () => abortController.abort();
}

const css = `
  & .nav-icon {
    height: 40%;
  }

  & .nav-icon-bigger {
    height: 55%;
  }

  & .nav-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & .edit-button {
    margin-top: 1rem;
  }

  & .edit-form {
    width: 55%;
  }

  & .edit-form > div {
    padding: 1rem;
  }

  & .edit-form > div > label > span {
    margin-right: 1rem;
  }

  & .edit-form > div > label > select {
    font-size: 1.8rem;
    padding: .4rem .6rem;
  }

  & .edit-form > .children-container {
    display: flex;
    justify-content: center;
  }
`;

type ViewLeadProps = {
  path?: string;
  leadId?: string;
};

type ContactStage = {
  first: string;
  second: string;
  third: string;
};

type EventSource = {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
};

type LeadService = {
  id: number;
  serviceName: string;
  programName: string;
};

type LeadUserRelationship = {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  timestamp: string;
};

export type SingleLead = {
  id?: number;
  dateOfSignUp?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  age?: number;
  gender?: string;
  phone?: string;
  smsConsent?: boolean;
  zip?: string;
  leadStatus?: string;
  inactivityReason?: string;
  clientId?: number;
  contactStage?: ContactStage;
  eventSources?: Array<EventSource>;
  leadServices?: Array<LeadService>;
  createdBy?: LeadUserRelationship;
  lastUpdatedBy?: LeadUserRelationship;
};
