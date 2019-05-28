import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import { useCss } from "kremling";
import checkedUrl from "../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../icons/148705-essential-collection/svg/close.svg";
import { countryCodeToName } from "../util/country-select.component";
import DemographicInformationInputs, {
  languageOptions,
  EnglishLevel,
  DemographicInformationClient
} from "../add-client/form-inputs/demographic-information-inputs.component";
import easyFetch from "../util/easy-fetch";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function ViewEditDemographicsInfo(
  props: ViewEditDemographicsInfoProps
) {
  const { client } = props;
  const [editing, setEditing] = React.useState(false);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null
  });

  const scope = useCss(css);

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: apiStatus.newClientData,
        signal: abortController.signal
      })
        .then(data => {
          dispatchApiStatus({ type: UpdateActionType.reset });
          setEditing(false);
          props.clientUpdated(data.client);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [apiStatus.isUpdating]);

  return (
    <ClientSection title="Demographics information">
      {editing ? (
        <DemographicInformationInputs
          client={getDemographicsClient()}
          onSubmit={handleSubmit}
        >
          {demographicsInfo => (
            <div className="actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setEditing(false)}
                disabled={apiStatus.isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary"
                disabled={apiStatus.isUpdating}
              >
                Update
              </button>
            </div>
          )}
        </DemographicInformationInputs>
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

  function handleSubmit(evt, newClientData) {
    evt.preventDefault();
    dispatchApiStatus({
      type: UpdateActionType.update,
      newClientData
    });
  }

  function getDemographicsClient(): DemographicInformationClient {
    return {
      civilStatus: client.civilStatus,
      householdIncome: client.householdIncome,
      householdSize: client.householdSize,
      juvenileDependents: client.dependents,
      currentlyEmployed: client.currentlyEmployed,
      weeklyEmployedHours: client.weeklyEmployedHours,
      employmentSector: client.employmentSector,
      payInterval: client.payInterval,
      countryOfOrigin: client.countryOfOrigin,
      dateOfUSArrival: client.dateOfUSArrival,
      homeLanguage: client.homeLanguage,
      isStudent: client.isStudent,
      englishLevel: client.englishProficiency,
      eligibleToVote: client.eligibleToVote,
      registerToVote: client.registeredToVote
    };
  }
}

function updatingReducer(state, action: UpdateAction) {
  switch (action.type) {
    case UpdateActionType.update:
      return { isUpdating: true, newClientData: action.newClientData };
    case UpdateActionType.reset:
      return { isUpdating: false };
    default:
      throw Error(`Unknown action type '${action.type}'`);
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

type UpdateAction = {
  type: UpdateActionType;
  newClientData?: DemographicInformationClient;
};

enum UpdateActionType {
  update = "update",
  reset = "reset"
}
