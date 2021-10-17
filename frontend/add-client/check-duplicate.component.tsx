import React from "react";
import user2Url from "../../icons/148705-essential-collection/svg/user-2.svg";
import { StepComponentProps, Step } from "./add-client.component";
import easyFetch from "../util/easy-fetch";
import BasicInformationInputs from "./form-inputs/basic-information-inputs.component";
import { useMatch } from "@reach/router";

export default function CheckDuplicate(props: StepComponentProps) {
  const leadMatch = useMatch("/leads/:leadId/convert-to-client");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img
            src={user2Url}
            className="hint-icon"
            alt="Check for duplicate users"
          />
        </div>
        <div className="instruction">
          Let's first check if this person already exists in the database.
        </div>
      </div>
      <BasicInformationInputs
        client={props.clientState}
        handleSubmit={handleSubmit}
        clientIntakeSettings={props.clientIntakeSettings}
        isNewClient
      >
        <div className="actions">
          <button type="submit" className="primary">
            <span>Check client</span>
          </button>
        </div>
      </BasicInformationInputs>
    </>
  );

  function handleSubmit(evt, data) {
    const { firstName, lastName, gender, birthday } = data;

    evt.preventDefault();
    easyFetch(
      `/api/client-duplicates?firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}&gender=${encodeURIComponent(
        gender
      )}&birthday=${encodeURIComponent(birthday)}`
    )
      .then(function (data) {
        // @ts-ignore
        if (leadMatch && leadMatch.leadId) {
          data.possibleLeadSources = data.possibleLeadSources.filter(
            // @ts-ignore
            (l) => String(l.id) !== leadMatch.leadId
          );
        }
        if (
          data.clientDuplicates.length > 0 ||
          data.possibleLeadSources.length > 0
        ) {
          props.showDuplicateWarning({
            firstName,
            lastName,
            birthday,
            gender,
            duplicates: data.clientDuplicates,
            possibleLeadSources: data.possibleLeadSources,
          });
        } else {
          props.nextStep(Step.CONTACT_INFORMATION, {
            firstName,
            lastName,
            gender,
            birthday,
          });
        }
      })
      .catch(function (err) {
        setTimeout(() => {
          throw err;
        });
      });
  }
}
