import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient, AuditSummary } from "../view-client.component";
import { useCss } from "kremling";
import checkedUrl from "../../../icons/148705-essential-collection/svg/checked-1.svg";
import closeUrl from "../../../icons/148705-essential-collection/svg/close.svg";
import { countryCodeToName } from "../../util/country-select.component";
import DemographicInformationInputs, {
  languageOptions,
  EnglishLevel,
  DemographicInformationClient,
  employmentSectors,
  payIntervals,
  civilStatuses,
} from "../../add-client/form-inputs/demographic-information-inputs.component";
import easyFetch from "../../util/easy-fetch";
import { isNumber } from "lodash-es";
import dayjs from "dayjs";
import { ClientIntakeSettings } from "../../admin/intake/client-intake-settings.component";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ViewEditDemographicsInfo(
  props: ViewEditDemographicsInfoProps
) {
  const { client } = props;
  const [editing, setEditing] = React.useState(false);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null,
  });

  const scope = useCss(css);

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: apiStatus.newClientData,
        signal: abortController.signal,
      })
        .then((data) => {
          dispatchApiStatus({ type: UpdateActionType.reset });
          setEditing(false);
          props.clientUpdated(data.client);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        });
    }
  }, [apiStatus.isUpdating]);

  return (
    <ClientSection
      title="Demographics information"
      auditSection={props.auditSummary && props.auditSummary.demographics}
    >
      {editing ? (
        <DemographicInformationInputs
          client={getDemographicsClient()}
          onSubmit={handleSubmit}
          isNewClient={false}
          clientIntakeSettings={props.clientIntakeSettings}
        >
          {(demographicsInfo) => (
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
        <>
          <table {...scope} className="client-table">
            <tbody>
              <tr>
                <td>Civil status:</td>
                <td>
                  {civilStatuses[client.civilStatus] ||
                    client.civilStatus ||
                    "\u2014"}
                </td>
              </tr>
              <tr>
                <td>Annual income:</td>
                <td>
                  {isNumber(client.householdIncome)
                    ? currencyFormatter.format(client.householdIncome)
                    : "\u2014"}
                </td>
              </tr>
              <tr>
                <td>Household size:</td>
                <td>
                  {isNumber(client.householdSize)
                    ? client.householdSize
                    : "\u2014"}
                </td>
              </tr>
              <tr>
                <td># of dependents under 18:</td>
                <td>
                  {isNumber(client.dependents) ? client.dependents : "\u2014"}
                </td>
              </tr>
              <tr>
                <td>Eligible to vote:</td>
                <td>
                  {client.eligibleToVote === null
                    ? "\u2014"
                    : client.eligibleToVote
                    ? "Yes"
                    : "No"}
                  {client.eligibleToVote !== null && (
                    <img
                      src={client.eligibleToVote ? checkedUrl : closeUrl}
                      alt={
                        client.eligibleToVote
                          ? "Eligible to vote"
                          : "Not eligible to vote"
                      }
                      title={
                        client.isStudent
                          ? "Eligible to vote"
                          : "Not eligible to vote"
                      }
                      className="inline-icon"
                    />
                  )}
                </td>
              </tr>
              {client.eligibleToVote && (
                <tr>
                  <td>Wants to register to vote:</td>
                  <td>
                    {client.registeredToVote ? "Yes" : "No"}
                    <img
                      src={client.registeredToVote ? checkedUrl : closeUrl}
                      alt={
                        client.registeredToVote
                          ? "Registered to vote"
                          : "Not registered to vote"
                      }
                      title={
                        client.isStudent
                          ? "Registered to vote"
                          : "Not registered to vote"
                      }
                      className="inline-icon"
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td>Student:</td>
                <td>
                  {client.isStudent === null
                    ? "\u2014"
                    : client.isStudent
                    ? "Yes"
                    : "No"}
                  {client.isStudent !== null && (
                    <img
                      src={client.isStudent ? checkedUrl : closeUrl}
                      alt={client.isStudent ? "Is student" : "Not student"}
                      title={client.isStudent ? "Is student" : "Not student"}
                      className="inline-icon"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Employment status:</td>
                <td>{employmentInfo()}</td>
              </tr>
              <tr>
                <td>Country of origin:</td>
                <td>{countryCodeToName[client.countryOfOrigin] || "\u2014"}</td>
              </tr>
              <tr>
                <td>Arrival to USA:</td>
                <td>
                  {client.dateOfUSArrival
                    ? dayjs(client.dateOfUSArrival).format("YYYY-MM-DD")
                    : "\u2014"}
                </td>
              </tr>
              <tr>
                <td>Language at home:</td>
                <td>
                  {languageOptions[client.homeLanguage] ||
                    client.homeLanguage ||
                    "\u2014"}
                </td>
              </tr>
              <tr>
                <td>English level:</td>
                <td>
                  {EnglishLevel[client.englishProficiency] ||
                    client.englishProficiency ||
                    "\u2014"}
                </td>
              </tr>
              {client.currentlyEmployed === "yes" && (
                <>
                  <tr>
                    <td>Employment sector:</td>
                    <td>{client.employmentSector}</td>
                  </tr>
                  <tr>
                    <td>Pay interval:</td>
                    <td>
                      {payIntervals[client.payInterval] || client.payInterval}
                    </td>
                  </tr>
                  <tr>
                    <td>Avg hours per week:</td>
                    <td>{client.weeklyEmployedHours}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          {props.editable && (
            <button
              className="secondary edit-button"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </>
      )}
    </ClientSection>
  );

  function employmentInfo() {
    switch (client.currentlyEmployed) {
      case "yes":
        return "employed";
      case "no":
        return `Not employed`;
      case "n/a":
        return `Not applicable`;
      default:
        return `\u2014`;
    }
  }

  function handleSubmit(evt, demographicsInfo: DemographicInformationClient) {
    evt.preventDefault();
    dispatchApiStatus({
      type: UpdateActionType.update,
      newClientData: {
        civilStatus: demographicsInfo.civilStatus,
        householdIncome: demographicsInfo.householdIncome,
        householdSize: demographicsInfo.householdSize,
        dependents: demographicsInfo.juvenileDependents,
        currentlyEmployed: demographicsInfo.currentlyEmployed,
        weeklyEmployedHours: demographicsInfo.weeklyEmployedHours,
        employmentSector: demographicsInfo.employmentSector,
        payInterval: demographicsInfo.payInterval,
        countryOfOrigin: demographicsInfo.countryOfOrigin,
        dateOfUSArrival: demographicsInfo.dateOfUSArrival,
        homeLanguage: demographicsInfo.homeLanguage,
        isStudent: demographicsInfo.isStudent,
        englishProficiency: demographicsInfo.englishLevel,
        eligibleToVote: demographicsInfo.eligibleToVote,
        registeredToVote: demographicsInfo.registerToVote,
      },
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
      registerToVote: client.registeredToVote,
    };
  }
}

ViewEditDemographicsInfo.defaultProps = {
  editable: true,
};

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
& .inline-icon {
  width: 1.6rem;
  margin-left: .8rem;
}
`;

type ViewEditDemographicsInfoProps = {
  client: SingleClient;
  clientUpdated?(client: SingleClient): void;
  auditSummary?: AuditSummary;
  editable?: boolean;
  clientIntakeSettings: ClientIntakeSettings;
};

type UpdateAction = {
  type: UpdateActionType;
  newClientData?: SingleClient;
};

enum UpdateActionType {
  update = "update",
  reset = "reset",
}
