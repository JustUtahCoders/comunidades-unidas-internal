import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import { useCss } from "kremling";
import editImg from "../../icons/148705-essential-collection/svg/edit.svg";
import checkedUrl from "../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../icons/148705-essential-collection/svg/close.svg";
import { countryCodeToName } from "../util/country-select.component";
import {
  languageOptions,
  EnglishLevel
} from "../add-client/demographic-information.component";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function ViewEditDemographicsInfo(
  props: ViewEditDemographicsInfoProps
) {
  const { client } = props;
  const [editing, setEditing] = React.useState(false);
  const scope = useCss(css);

  return (
    <ClientSection title="Demographics information">
      {editing ? (
        <div>editing</div>
      ) : (
        <article className="view-demographics-info" {...scope}>
          <section>
            <h4 style={{ marginTop: 0 }}>Household information</h4>
            <div>
              {currencyFormatter.format(client.householdIncome)} household
              income
            </div>
            <div>
              {client.householdSize}{" "}
              {client.householdSize === 1 ? "person" : "people"} in household
            </div>
            <div>
              {client.dependents} minor{client.dependents === 1 ? "" : "s"} in
              home
            </div>
            <div>
              {languageOptions[client.homeLanguage] || client.homeLanguage}{" "}
              spoken in home
            </div>
          </section>
          <section>
            <h4>Personal information</h4>
            <div>{client.civilStatus}</div>
            <div>{voterEligibility()}</div>
            {client.eligibleToVote && wantsToRegisterToVote()}
            <div>{client.isStudent ? "Student" : "Not student"}</div>
            <div>{employmentInfo()}</div>
            <div>
              Born in{" "}
              {countryCodeToName[client.countryOfOrigin] || "Unknown country"}
            </div>
            {client.countryOfOrigin === "US" ? null : (
              <div>{client.dateOfUSArrival || "Unknown"} arrival to USA</div>
            )}
            <div>
              {EnglishLevel[client.englishProficiency] ||
                client.englishProficiency}{" "}
              English level
            </div>
          </section>
          <button
            className="secondary edit-button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </article>
      )}
    </ClientSection>
  );

  function voterEligibility() {
    if (client.eligibleToVote) {
      return (
        <div className="text-with-inline-icon">
          Eligible to vote{" "}
          <img
            src={checkedUrl}
            alt="eligible to vote"
            title="Eligible to vote"
            className="inline-icon"
          />
        </div>
      );
    } else {
      return (
        <div className="text-with-inline-icon">
          Not eligible to vote{" "}
          <img
            src={closeUrl}
            alt="not eligible to vote"
            title="Not eligible to vote"
            className="inline-icon"
          />
        </div>
      );
    }
  }

  function wantsToRegisterToVote() {
    if (client.eligibleToVote) {
      return (
        <div className="text-with-inline-icon">
          Wants to register to vote
          <img
            src={checkedUrl}
            alt="wants to register to vote"
            title="Wants to register to vote"
            className="inline-icon"
          />
        </div>
      );
    } else {
      return (
        <div className="text-with-inline-icon">
          Does not want to register to vote
          <img
            src={closeUrl}
            alt="does not want to register to vote"
            title="Does not want to register to vote"
            className="inline-icon"
          />
        </div>
      );
    }
  }

  function employmentInfo() {
    switch (client.currentlyEmployed) {
      case "yes":
        return `Employed - ${client.employmentSector} - ${client.payInterval}`;
      case "no":
        return `Not employed`;
      case "n/a":
        return `Employment not applicable`;
      default:
        return `Unknown employment status`;
    }
  }
}

const css = `
& .view-demographics-info, .view-demographics-info > section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

& .view-demographics-info h4 {
  text-align: center;
  margin-bottom: .4rem;
}

& .text-with-inline-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

& .inline-icon {
  width: 1.6rem;
  margin-left: .8rem;
}
`;

type ViewEditDemographicsInfoProps = {
  client: SingleClient;
  clientUpdated(client: SingleClient): void;
};
