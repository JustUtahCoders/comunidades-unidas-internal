import React from "react";
import { Step, StepComponentProps } from "./add-client.component";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import easyFetch from "../util/easy-fetch";

export default function Confirm(props: StepComponentProps) {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" />
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
            onClick={() => props.goBack(Step.CLIENT_SOURCE)}
          >
            Go back
          </button>
          <button type="submit" className="primary">
            Confirm
          </button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();

    const d = props.clientState;

    easyFetch("/api/clients", {
      method: "POST",
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
        primaryLanguage: d.primaryLanguage,
        currentlyEmployed: d.currentlyEmployed,
        employmentSector: d.employmentSector,
        payInterval: d.payInterval,
        weeklyEmployedHours: d.weeklyEmployedHours,
        annualIncome: d.annualIncome,
        householdSize: d.householdSize,
        isStudent: d.isStudent,
        eligibleToVote: d.eligibleToVote,
        clientSource: d.clientSource,
        couldVolunteer: d.couldVolunteer
      }
    })
      .then(function(data) {
        props.nextStep(Step.FINISHED, {});
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  function addAnother() {
    props.reset();
  }
}
