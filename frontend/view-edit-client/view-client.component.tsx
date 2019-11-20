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
import Integrations from "./integrations/integrations.component";
import { always, useCss } from "kremling";
import homeImgUrl from "../../icons/148705-essential-collection/svg/home.svg";
import historyImgUrl from "../../icons/148705-essential-collection/svg/notepad.svg";
import integrationsImgUrl from "../../icons/148705-essential-collection/svg/cloud-computing-3.svg";
import addNewImgUrl from "../../icons/148705-essential-collection/svg/add-1.svg";
import { IntakeService } from "../util/services-inputs.component";

export default function ViewClient(props: ViewClientProps) {
  const [client, setClient] = React.useState<SingleClient>(null);
  const [error, setError] = React.useState(null);
  const [auditSummary, setAuditSummary] = React.useState<AuditSummary>(null);
  const [clientIsStale, setClientIsStale] = React.useState(false);
  const clientId = props.clientId;
  const scope = useCss(css);

  React.useEffect(() => {
    return fetchClient();
  }, [clientId]);

  React.useEffect(() => {
    if (clientIsStale) {
      return fetchClient();
    }
  }, [clientIsStale]);

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

  const childProps = {
    client,
    setClient,
    auditSummary,
    clientId,
    refetchClient: () => setClientIsStale(true)
  };

  return (
    <div {...scope}>
      <PageHeader title={getHeaderTitle()} withSecondaryNav />
      <StickySecondaryNav>
        <div className="nav-container">
          <ul>
            <li>
              <Link to={`/clients/${clientId}`} getProps={getLinkProps}>
                <img
                  src={homeImgUrl}
                  alt="Home icon"
                  title={possessiveClientName() + " home"}
                />
              </Link>
            </li>
            <li>
              <Link to={`/clients/${clientId}/history`} getProps={getLinkProps}>
                <img src={historyImgUrl} alt="Notepad icon" title="History" />
              </Link>
            </li>
            <li>
              <Link
                to={`/clients/${clientId}/integrations`}
                getProps={getLinkProps}
              >
                <img
                  src={integrationsImgUrl}
                  alt="Cloud server refresh icon"
                  title="Integrations"
                />
              </Link>
            </li>
            <li>
              <Link
                to={`/clients/${clientId}/add-info`}
                getProps={getLinkProps}
              >
                <img src={addNewImgUrl} alt="Plus sign icon" title="Add new" />
              </Link>
            </li>
          </ul>
          <div style={{ padding: "0 1.6rem" }}>
            {client ? client.firstName : ""}
          </div>
        </div>
      </StickySecondaryNav>
      <Router>
        <ClientHome path="/" {...childProps} />
        <ClientHistory path="history" {...childProps} />
        <ClientAddNewInfo path="add-info" {...childProps} />
        <AddCaseNote path="add-case-note" {...childProps} />
        <AddClientInteraction path="add-client-interaction" {...childProps} />
        <Integrations path="integrations" {...childProps} />
      </Router>
    </div>
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
    return {
      className: always("secondary-nav-link").maybe("active", isCurrent)
    };
  }

  function fetchClient() {
    const abortController = new AbortController();

    easyFetch(`/api/clients/${clientId}`, { signal: abortController.signal })
      .then(data => {
        setClient(data.client);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setClientIsStale(false);
      });

    return () => abortController.abort();
  }

  function possessiveClientName() {
    if (client) {
      return client.firstName + (client.firstName.endsWith("s") ? "'" : "'s");
    } else {
      return "Client's";
    }
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
