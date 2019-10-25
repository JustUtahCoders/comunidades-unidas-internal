import React from "react";
import { useCss } from "kremling";
import { Link, Router } from "@reach/router";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";
import LeadHome from "./lead-home/lead-home.component";

export default function ViewLead(props: ViewLeadProps) {
  const [lead, setLead] = React.useState<SingleLead>(null);
  const [error, setError] = React.useState(null);
  const [leadIsStale, setLeadIsStale] = React.useState(false);
  const leadId = props.leadId;
  const scope = useCss(css);

  React.useEffect(() => {
    return fetchLead();
  }, [leadId]);

  React.useEffect(() => {
    if (leadIsStale) {
      return fetchLead();
    }
  }, [leadIsStale]);

  return (
    <div {...scope}>
      <PageHeader title={getHeaderTitle()} />
      <Router>{/* <LeadHome path="/" {...childProps} /> */}</Router>
    </div>
  );

  function getHeaderTitle() {
    if (error && error.status === 404) {
      return `Could not find lead ${leadId}`;
    } else if (error && error.status === 400) {
      return `Invalid lead id '${leadId}'`;
    } else if (lead) {
      return lead.fullName;
    } else {
      return "Loading lead...";
    }
  }

  function fetchLead() {
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
  }
}

const css = `
	& .secondary-nav-link img {
		height: 40%;
	}

	& .nav-container {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
`;

type ViewLeadProps = {
  path?: string;
  leadId?: string;
};

export type SingleLead = {
  id?: number;
  dateOfSignUp?: string;
  leadStatus?: string;
  contactStage: ContactStage;
  inactivityReason?: string;
  eventSources: Array<EventSource>;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  smsConsent?: boolean;
  zip?: string;
  age?: number;
  gender?: string;
  leadServices?: Array<LeadService>;
  createdBy?: ClientUserRelationship;
  lastUpdatedBy?: ClientUserRelationship;
};

type ClientUserRelationship = {
  userId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  timestamp?: string;
};

type ContactStage = {
  first?: string;
  second?: string;
  third?: string;
};

type EventSource = {
  eventId?: number;
  eventName?: string;
  eventLocation?: string;
};

type LeadService = {
  id?: number;
  serviceName?: string;
};
