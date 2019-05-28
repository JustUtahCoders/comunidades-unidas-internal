import React from "react";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";
import ViewEditBasicInfo from "./view-edit-basic-info.component";
import {
  CivilStatus,
  PayInterval
} from "../add-client/demographic-information.component";
import { ClientSources } from "../add-client/add-client.component";
import ViewEditContactInfo from "./view-edit-contact-info.component";
import ViewEditDemographicsInfo from "./view-edit-demographics-info.component";

export default function ViewClient(props: ViewClientProps) {
  const [client, setClient] = React.useState<SingleClient>(null);
  const [error, setError] = React.useState(null);
  const clientId = props.clientId;

  React.useEffect(() => {
    easyFetch(`/api/clients/${clientId}`)
      .then(data => {
        setClient(data.client);
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }, [clientId]);

  return (
    <>
      <PageHeader title={getHeaderTitle()} />
      {client && typeof client === "object" && (
        <div style={{ marginBottom: "3.2rem" }}>
          <ViewEditBasicInfo client={client} clientUpdated={setClient} />
          <ViewEditContactInfo client={client} clientUpdated={setClient} />
          <ViewEditDemographicsInfo client={client} clientUpdated={setClient} />
        </div>
      )}
    </>
  );

  function getHeaderTitle() {
    if (error && error.status === 404) {
      return `Could not find client ${clientId}`;
    } else if (error && error.status === 400) {
      return `Invalid client id '${clientId}'`;
    } else if (client) {
      return `Client: ${client.fullName}`;
    } else {
      return "Loading client...";
    }
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

type WeeklyEmployedHours = {
  "0-20": "0-20";
  "21-35": "21-35";
  "36-40": "36-40";
  "41+": "41+";
};

type ClientUserRelationship = {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  timestamp: string;
};
