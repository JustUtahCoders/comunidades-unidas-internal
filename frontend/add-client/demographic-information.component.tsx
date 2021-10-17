import React from "react";

import { StepComponentProps, Step } from "./add-client.component";
import demographicIconUrl from "../../icons/148705-essential-collection/svg/resume.svg";
import DemographicInformationInputs from "./form-inputs/demographic-information-inputs.component";

export default function DemographicInformation(props: StepComponentProps) {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img
            src={demographicIconUrl}
            className="hint-icon"
            alt="Paper document icon"
          />
        </div>
        <div className="instruction">
          Almost done, now add demographic information for{" "}
          <strong>
            {props.clientState.firstName} {props.clientState.lastName}
          </strong>
          .
        </div>
      </div>
      <DemographicInformationInputs
        client={props.clientState}
        onSubmit={handleSubmit}
        isNewClient
        clientIntakeSettings={props.clientIntakeSettings}
      >
        {(demographicInfo) => (
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() =>
                props.goBack(
                  Step.CONTACT_INFORMATION,
                  transformDemographicInfo(demographicInfo)
                )
              }
            >
              Go back
            </button>
            <button type="submit" className="primary">
              Next step
            </button>
          </div>
        )}
      </DemographicInformationInputs>
    </>
  );

  function handleSubmit(evt, demographicInfo) {
    evt.preventDefault();
    props.nextStep(
      Step.CLIENT_SOURCE,
      transformDemographicInfo(demographicInfo)
    );
  }

  function transformDemographicInfo(demographicInfo) {
    return {
      civilStatus: demographicInfo.civilStatus,
      countryOfOrigin: demographicInfo.countryOfOrigin,
      dateOfUSArrival: demographicInfo.dateOfUSArrival,
      homeLanguage: demographicInfo.homeLanguage,
      englishLevel: demographicInfo.englishLevel,
      currentlyEmployed: demographicInfo.currentlyEmployed,
      employmentSector: demographicInfo.employmentSector,
      payInterval: demographicInfo.payInterval,
      weeklyEmployedHours: demographicInfo.weeklyEmployedHours,
      householdIncome: demographicInfo.householdIncome,
      householdSize: demographicInfo.householdSize,
      isStudent: demographicInfo.isStudent,
      eligibleToVote: demographicInfo.eligibleToVote,
      juvenileDependents: demographicInfo.juvenileDependents,
      registerToVote: demographicInfo.registerToVote,
    };
  }
}
