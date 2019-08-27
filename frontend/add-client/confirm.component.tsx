import React from "react";
import { Step, StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import easyFetch from "../util/easy-fetch";

export default function Confirm(props: StepComponentProps) {
  const [saving, setSaving] = React.useState(false);

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
          intakeServices: d.intakeServices
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

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" alt="Success icon" />
        </div>
        <div className="instruction">
          Ok. Ready to save {props.clientState.firstName}{" "}
          {props.clientState.lastName} to database.
        </div>
      </div>
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
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setSaving(true);
  }
}
