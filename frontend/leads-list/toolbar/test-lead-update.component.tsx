import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";

export default function TestUpdateLeads(props: TestUpdateLeadsProps) {
  const scope = useCss(css);
  const [lead, setLead] = React.useState<SingleLead>(null);
  const [error, setError] = React.useState(null);
  const [leadIsStale, setLeadIsStale] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState("pending");

  const leadId = 26;

  const fakeLeadData = {
    dateOfSignUp: "2019-10-10",
    firstName: "Updated",
    lastName: "TestLead",
    phone: "3333333333",
    smsConsent: false,
    age: 50,
    gender: "female",
    eventSources: [1, 14],
    leadServices: [32, 34, 29, 4, 9, 11, 13]
  };

  React.useEffect(() => {
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
  }, [leadId]);

  function updateLead(data) {
    const abortController = new AbortController();

    easyFetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      signal: abortController.signal,
      body: {
        dateOfSignUp: fakeLeadData.dateOfSignUp,
        firstName: fakeLeadData.firstName,
        lastName: fakeLeadData.lastName,
        phone: fakeLeadData.phone,
        smsConsent: fakeLeadData.smsConsent,
        age: fakeLeadData.age,
        gender: fakeLeadData.gender,
        eventSources: fakeLeadData.eventSources,
        leadServices: fakeLeadData.leadServices
      }
    })
      .then(result => {
        console.log(result);
        setTestStatus("success?");
      })
      .catch(err => {
        console.error(err);
        setTestStatus("failed");
        setError(err);
      });
  }

  console.log(testStatus);
  console.log(error);

  return (
    <>
      <div
        className="test-button"
        onClick={() => updateLead(fakeLeadData)}
        {...scope}
      >
        Update Test Lead
      </div>
      {lead !== null && (
        <p>
          #{lead.id} - {lead.firstName} {lead.lastName}
        </p>
      )}
    </>
  );
}

const css = `
	& .test-button {
		background-color: blue;
		color: white;
		font-size: 2rem;
		border: white 2px solid;
		text-align: center;
		padding: 10px 30px 10px 30px;
		width: 25rem;
		border-radius: 15px;
	}
`;

type TestUpdateLeadsProps = {};

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
