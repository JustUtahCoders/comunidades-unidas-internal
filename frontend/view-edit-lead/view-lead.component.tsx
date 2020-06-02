import React from "react";
import easyFetch from "../util/easy-fetch";
import { useCss } from "kremling";
import { Router } from "@reach/router";
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

  const childProps = {
    lead,
    setLead,
    leadId,
    refetchLead: () => setLeadIsStale(true),
  };

  return (
    <div {...scope}>
      <PageHeader title={getHeaderTitle()} />
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

  function fetchLead() {
    const abortController = new AbortController();

    easyFetch(`/api/leads/${leadId}`, { signal: abortController.signal })
      .then((data) => {
        setLead(data.lead);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLeadIsStale(false);
      });

    return () => abortController.abort();
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

  & .edit-button {
    margin-top: 1rem;
  }

  & .edit-form {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
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

export type CUEventSource = {
  id?: number;
  eventId?: number;
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
  leadStatus?: LeadStatus;
  inactivityReason?: string;
  clientId?: number;
  contactStage?: ContactStage;
  eventSources?: Array<CUEventSource>;
  leadServices?: Array<LeadService>;
  createdBy?: LeadUserRelationship;
  lastUpdatedBy?: LeadUserRelationship;
};

export enum LeadStatus {
  active = "active",
  inactive = "inactive",
  convertedToClient = "convertedToClient",
}
