import React from "react";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";
import {
  CivilStatus,
  PayInterval,
  WeeklyEmployedHours
} from "../add-client/form-inputs/demographic-information-inputs.component";
import { ClientSources } from "../add-client/add-client.component";
import StickySecondaryNav from "../navbar/sticky-secondary-nav.component";
import { Link, Router } from "@reach/router";
import ClientHome from "./client-home/client-home.component";
import ClientHistory from "./client-history/client-history.component";
import ClientAddNewInfo from "./add-new/client-add-new-info.component";
import AddCaseNote from "./case-notes/add-case-note.component";
import AddClientInteraction from "./interactions/add-client-interaction.component";

export default function ViewClient(props: ViewClientProps) {
  const [client, setClient] = React.useState<SingleClient>(null);
  const [error, setError] = React.useState(null);
  const [auditSummary, setAuditSummary] = React.useState<AuditSummary>(null);
  const clientId = props.clientId;

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch(`/api/clients/${clientId}`, { signal: abortController.signal })
      .then(data => {
        setClient(data.client);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });

    return () => abortController.abort();
  }, [clientId]);

  React.useEffect(() => {
    if (client) {
      const abortController = new AbortController();

      easyFetch(`/api/clients/${clientId}/audits`, {
        signal: abortController.signal
      })
        .then(data => {
          setAuditSummary(data.auditSummary);
        })
        .catch(err => {
          console.error(err);
          setError(err);
        });

      return () => abortController.abort();
    }
  }, [client]);

  const childProps = { client, setClient, auditSummary, clientId };

  return (
    <>
      <PageHeader title={getHeaderTitle()} withSecondaryNav />
      <StickySecondaryNav>
        <ul>
          <li>
            <Link to={`/clients/${clientId}`} getProps={getLinkProps}>
              {client
                ? client.firstName +
                  `'${client.firstName.endsWith("s") ? "" : `s`}`
                : "Client"}{" "}
              info
            </Link>
          </li>
          <li>
            <Link to={`/clients/${clientId}/history`} getProps={getLinkProps}>
              History
            </Link>
          </li>
          <li>
            <Link to={`/clients/${clientId}/add-info`} getProps={getLinkProps}>
              Add new
            </Link>
          </li>
        </ul>
      </StickySecondaryNav>
      <Router>
        <ClientHome path="/" {...childProps} />
        <ClientHistory path="history" {...childProps} />
        <ClientAddNewInfo path="add-info" {...childProps} />
        <AddCaseNote path="add-case-note" {...childProps} />
        <AddClientInteraction path="add-client-interaction" {...childProps} />
      </Router>
    </>
  );

  function getHeaderTitle() {
    if (error && error.status === 404) {
      return `Could not find client ${clientId}`;
    } else if (error && error.status === 400) {
      return `Invalid client id '${clientId}'`;
    } else if (client) {
      return client.fullName;
    } else {
      return "Loading client...";
    }
  }

  function getLinkProps({ isCurrent }) {
    return isCurrent ? { className: "active" } : null;
  }
}

type ViewClientProps = {
  path?: string;
  clientId?: string;
};

export type SingleClient = {
  id?: number;
  dateOfIntake?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  smsConsent?: boolean;
  homeAddress?: Address;
  email?: string;
  civilStatus?: CivilStatus;
  countryOfOrigin?: string;
  dateOfUSArrival?: string;
  homeLanguage?: string;
  englishProficiency?: string;
  currentlyEmployed?: string;
  employmentSector?: string;
  payInterval?: PayInterval;
  weeklyEmployedHours?: WeeklyEmployedHours;
  householdIncome?: number;
  householdSize?: number;
  dependents?: number;
  housingStatus?: string;
  isStudent?: boolean;
  eligibleToVote?: boolean;
  registeredToVote?: boolean;
  clientSource?: ClientSources;
  couldVolunteer?: boolean;
  intakeServices?: IntakeService[];
  createdBy?: ClientUserRelationship;
  lastUpdatedBy?: ClientUserRelationship;
};

type IntakeService = {
  id: number;
  serviceName: string;
  serviceDescription: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type ClientUserRelationship = {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  timestamp: string;
};

export type AuditSummary = {
  client: {
    lastUpdate: LastUpdate;
  };
  contactInformation: {
    numWrites: number;
    lastUpdate: LastUpdate;
  };
  demographics: {
    numWrites: number;
    lastUpdate: LastUpdate;
  };
  intakeData: {
    numWrites: number;
    lastUpdate: LastUpdate;
  };
};

export type LastUpdate = {
  fullName: string;
  firstName: string;
  lastName: string;
  timestamp: string;
};
