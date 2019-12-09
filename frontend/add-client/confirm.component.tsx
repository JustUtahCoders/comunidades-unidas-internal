import React from "react";
import {
  Step,
  StepComponentProps,
  ClientSources
} from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import easyFetch from "../util/easy-fetch";
import ViewEditBasicInfo from "../view-edit-client/client-home/view-edit-basic-info.component";
import { SingleClient } from "../view-edit-client/view-client.component";
import { useCss } from "kremling";
import ViewEditContactInfo from "../view-edit-client/client-home/view-edit-contact-info.component";
import ViewEditDemographicsInfo from "../view-edit-client/client-home/view-edit-demographics-info.component";
import ViewEditIntakeInfo from "../view-edit-client/client-home/view-edit-intake-info.component";

export default function Confirm(props: StepComponentProps) {
  const [saving, setSaving] = React.useState(false);
  const scope = useCss(css);

  React.useEffect(() => {
    if (saving) {
      const d = props.clientState;
      const abortController = new AbortController();

      easyFetch("/api/clients", {
        method: "POST",
        signal: abortController.signal,
        body: {
          dateOfIntake: d.dateOfIntake,
          firstName: d.firstName,
          lastName: d.lastName,
          birthday: d.birthday,
          gender: d.gender,
          phone: d.phone,
          smsConsent: d.smsConsent,
          homeAddress: {
            street: d.streetAddress,
            city: d.city,
            state: d.state,
            zip: d.zip
          },
          email: d.email,
          civilStatus: d.civilStatus,
          countryOfOrigin: d.countryOfOrigin,
          dateOfUSArrival: d.dateOfUSArrival || null,
          homeLanguage: d.homeLanguage,
          englishProficiency: d.englishLevel,
          currentlyEmployed: d.currentlyEmployed,
          employmentSector: d.employmentSector,
          payInterval: d.payInterval,
          weeklyEmployedHours: d.weeklyEmployedHours || null,
          householdIncome: d.householdIncome,
          householdSize: d.householdSize,
          dependents: d.juvenileDependents,
          housingStatus: d.housing || null,
          isStudent: d.isStudent,
          eligibleToVote: d.eligibleToVote,
          clientSource: d.clientSource,
          couldVolunteer: d.couldVolunteer,
          intakeServices: d.intakeServices.map(service => service.id),
          leadId: props.lead.id || null
        }
      })
        .then(function(data) {
          setSaving(false);
          props.nextStep(Step.FINISHED, { id: data.client.id });
        })
        .catch(err => {
          setSaving(false);
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [saving, props.clientState]);

  const c = props.clientState;

  const viewableClient: SingleClient = {
    id: Number(c.id),
    firstName: c.firstName,
    lastName: c.lastName,
    fullName: `${c.firstName} ${c.lastName}`.trim(),
    birthday: c.birthday,
    gender: c.gender,
    phone: c.phone,
    smsConsent: c.smsConsent,
    homeAddress: {
      city: c.city,
      state: c.state,
      street: c.streetAddress,
      zip: c.zip
    },
    email: c.email,
    civilStatus: c.civilStatus,
    countryOfOrigin: c.countryOfOrigin,
    dateOfUSArrival: c.dateOfUSArrival,
    homeLanguage: c.homeLanguage,
    englishProficiency: c.englishLevel,
    currentlyEmployed: c.currentlyEmployed,
    employmentSector: c.employmentSector,
    payInterval: c.payInterval,
    weeklyEmployedHours: c.weeklyEmployedHours,
    householdIncome: c.householdIncome,
    householdSize: c.householdSize,
    dependents: c.juvenileDependents,
    housingStatus: c.housing,
    isStudent: c.isStudent,
    eligibleToVote: c.eligibleToVote,
    registeredToVote: c.registerToVote,
    clientSource: ClientSources[c.clientSource],
    couldVolunteer: c.couldVolunteer,
    intakeServices: c.intakeServices
  };

  return (
    <div {...scope}>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" alt="Success icon" />
        </div>
        <div className="instruction">
          Ok. Ready to save {props.clientState.firstName}{" "}
          {props.clientState.lastName} to database.
        </div>
      </div>
      <ViewEditBasicInfo client={viewableClient} editable={false} />
      <ViewEditContactInfo client={viewableClient} editable={false} />
      <ViewEditDemographicsInfo client={viewableClient} editable={false} />
      <ViewEditIntakeInfo client={viewableClient} editable={false} />
      <form onSubmit={handleSubmit}>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.SERVICES)}
          >
            Go back
          </button>
          <button type="submit" className="primary" disabled={saving}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setSaving(true);
  }
}

const css = `
& .card {
  border: .1rem solid lightgray;
}
`;
