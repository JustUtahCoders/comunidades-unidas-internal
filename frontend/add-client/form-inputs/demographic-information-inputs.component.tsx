import React, { useState } from "react";
import CountrySelect from "../../util/country-select.component";
import CurrencyInput from "../../util/currency-input.component";
import { isEmpty } from "lodash-es";
import { renderDynamicallyOrderedQuestions } from "./dynamic-question-helpers";
import { ClientIntakeSettings } from "../../admin/intake/client-intake-settings.component";
import { IntakeQuestion } from "../../admin/intake/intake-setting.component";

export default function DemographicInformationInputs(
  props: DemographicInformationInputsProps
) {
  const [civilStatus, setCivilStatus] = useState<CivilStatus>(
    CivilStatus[props.client.civilStatus] ||
      (props.isNewClient ? CivilStatus.single : CivilStatus.unknown)
  );
  const [householdIncome, setHouseholdIncome] = useState(
    props.client.householdIncome
  );
  const [householdSize, setHouseholdSize] = useState(
    props.client.householdSize || (props.isNewClient ? 1 : "")
  );
  const [juvenileDependents, setJuvenileDependents] = useState(
    props.client.juvenileDependents || (props.isNewClient ? 0 : "")
  );
  const [currentlyEmployed, setCurrentlyEmployed] = useState(
    props.client.currentlyEmployed || "unknown"
  );
  const [
    weeklyEmployedHours,
    setWeeklyEmployedHours,
  ] = useState<WeeklyEmployedHours>(
    props.client.weeklyEmployedHours || WeeklyEmployedHours["0-20"]
  );
  const [employmentSector, setEmploymentSector] = useState(
    getInitialEmploymentSector(props.client.employmentSector)
  );
  const [empSectorExplain, setEmpSectorExplain] = useState(
    getInitialOtherEmploymentSector(props.client.employmentSector)
  );
  const [payInterval, setPayInterval] = useState<PayInterval>(
    PayInterval[props.client.payInterval] || PayInterval["every-two-weeks"]
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    props.client.countryOfOrigin || (props.isNewClient ? "US" : "")
  );
  const [dateOfUSArrival, setDateOfUSArrival] = useState(
    props.client.dateOfUSArrival || ""
  );
  const [homeLanguage, setHomeLanguage] = useState(
    getInitialHomeLanguage(props.client.homeLanguage, props.isNewClient)
  );
  const [otherLanguage, setOtherLanguage] = useState(
    getInitialOtherHomeLanguage(props.client.homeLanguage)
  );
  const [isStudent, setIsStudent] = useState(
    props.isNewClient ? props.client.isStudent || false : props.client.isStudent
  );
  const [englishLevel, setEnglishLevel] = useState(
    props.client.englishLevel || "unknown"
  );
  const [eligibleToVote, setEligibleToVote] = useState(
    props.isNewClient
      ? props.client.eligibleToVote || null
      : props.client.eligibleToVote
  );
  const [registerToVote, setRegisterToVote] = useState(
    props.client.registerToVote || false
  );

  const demographicInfo: DemographicInformationClient = {
    civilStatus:
      isEmpty(civilStatus) || civilStatus === "unknown"
        ? null
        : (civilStatus as CivilStatus),
    countryOfOrigin: isEmpty(countryOfOrigin) ? null : countryOfOrigin,
    dateOfUSArrival: fullDateOfUSArrival(dateOfUSArrival),
    homeLanguage:
      homeLanguage === "other"
        ? otherLanguage
        : isEmpty(homeLanguage) || homeLanguage === "unknown"
        ? null
        : homeLanguage,
    englishLevel: englishLevel === "unknown" ? null : englishLevel,
    currentlyEmployed,
    employmentSector:
      employmentSector === "other"
        ? empSectorExplain
        : employmentSector || null,
    payInterval,
    weeklyEmployedHours,
    householdIncome,
    householdSize: householdSize === "" ? null : Number(householdSize),
    isStudent,
    eligibleToVote,
    registerToVote,
    juvenileDependents:
      juvenileDependents === "" ? null : Number(juvenileDependents),
  };

  const questionRenderers = {
    civilStatus: renderCivilStatus,
    householdIncome: renderHouseholdIncome,
    householdSize: renderHouseholdSize,
    dependents: renderJuvenileDependents,
    eligibleToVote: renderEligibleToVote,
    registeredToVote: renderRegisterToVote,
    isStudent: renderIsStudent,
    currentlyEmployed: renderCurrentlyEmployed,
    employmentSector: renderEmploymentSector,
    payInterval: renderPayInterval,
    weeklyEmployedHours: renderAvgWeeklyHoursWorked,
    countryOfOrigin: renderCountryOfOrigin,
    dateOfUSArrival: renderDateOfUSArrival,
    homeLanguage: renderHomeLanguage,
    englishProficiency: renderEnglishLevel,
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="new-password">
      {renderDynamicallyOrderedQuestions(
        props.clientIntakeSettings.demographicInfo,
        questionRenderers
      )}
      {props.children(demographicInfo)}
    </form>
  );

  function renderCivilStatus(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            value={civilStatus}
            name="civilStatus"
            onChange={(evt) => setCivilStatus(CivilStatus[evt.target.value])}
            required={question.required}
            placeholder={question.placeholder}
            autoFocus
          >
            {Object.keys(civilStatuses).map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {civilStatuses[statusKey]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function renderHouseholdIncome(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <CurrencyInput
            setDollars={setHouseholdIncome}
            initialValue={householdIncome}
            required={question.required && props.isNewClient}
            placeholder={question.placeholder}
          />
        </label>
      </div>
    );
  }

  function renderHouseholdSize(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="number"
            value={householdSize}
            onChange={(evt) => setHouseholdSize(Number(evt.target.value))}
            required={question.required && props.isNewClient}
            placeholder={question.placeholder}
            min={1}
            max={30}
          />
        </label>
      </div>
    );
  }

  function renderJuvenileDependents(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <input
            type="number"
            value={juvenileDependents}
            onChange={(evt) => setJuvenileDependents(Number(evt.target.value))}
            required={question.required && props.isNewClient}
            placeholder={question.placeholder}
            min={0}
            max={30}
          />
        </label>
      </div>
    );
  }

  function renderEligibleToVote(question: IntakeQuestion) {
    return (
      <div>
        <div role="group" aria-labelledby="is-eligible-to-vote">
          <span id="is-eligible-to-vote">{question.label}</span>
          <div className="radio-options">
            <div>
              <label>
                <input
                  type="radio"
                  name="eligible-to-vote"
                  value="true"
                  onChange={() => setEligibleToVote(true)}
                  checked={eligibleToVote}
                />
                Eligible to vote
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="eligible-to-vote"
                  value="false"
                  onChange={() => {
                    setEligibleToVote(false);
                    setRegisterToVote(false);
                  }}
                  checked={!eligibleToVote && eligibleToVote !== null}
                />
                Not eligible to vote
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="eligible-to-vote"
                  value="unknown"
                  onChange={() => {
                    setEligibleToVote(null);
                    setRegisterToVote(null);
                  }}
                  checked={eligibleToVote === null}
                />
                Unknown
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderRegisterToVote(question: IntakeQuestion) {
    return (
      eligibleToVote && (
        <div>
          <div role="group" aria-labelledby="desire-to-register-vote">
            <span id="desire-to-register-vote">{question.label}</span>
            <div className="radio-options">
              <div>
                <label>
                  <input
                    type="radio"
                    name="register-to-vote"
                    value="true"
                    onChange={() => setRegisterToVote(true)}
                    checked={registerToVote}
                  />
                  Wants to register to vote
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="do-not-register-to-vote"
                    value="false"
                    onChange={() => setRegisterToVote(false)}
                    checked={!registerToVote}
                  />
                  Does not want to register to vote
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  function renderIsStudent(question: IntakeQuestion) {
    return (
      <div>
        <div role="group" aria-labelledby="is-student">
          <span id="is-student">{question.label}</span>
          <div className="radio-options">
            <div>
              <label>
                <input
                  type="radio"
                  name="student"
                  value="true"
                  onChange={() => setIsStudent(true)}
                  checked={isStudent}
                />
                Student
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="student"
                  value="false"
                  onChange={() => setIsStudent(false)}
                  checked={!isStudent && isStudent !== null}
                />
                Not student
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="student"
                  value="unknown"
                  onChange={() => setIsStudent(null)}
                  checked={isStudent === null}
                />
                Unknown
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderCurrentlyEmployed(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            value={currentlyEmployed}
            name="currentlyEmployed"
            onChange={(evt) => {
              setCurrentlyEmployed(evt.target.value);
              if (evt.target.value !== "yes") {
                setEmploymentSector(getInitialEmploymentSector(null));
                setEmpSectorExplain("");
                setWeeklyEmployedHours(WeeklyEmployedHours["0-20"]);
              }
            }}
            required={question.required}
            placeholder={question.placeholder}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="n/a">Not Applicable</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    );
  }

  function renderEmploymentSector(question: IntakeQuestion) {
    return (
      currentlyEmployed == "yes" && (
        <>
          <div>
            <label>
              <span>{question.label}</span>
              <select
                value={employmentSector}
                name="employmentSector"
                onChange={(evt) => setEmploymentSector(evt.target.value)}
                required={question.required}
                placeholder={question.placeholder}
              >
                {Object.keys(employmentSectors).map((sectorValue) => (
                  <option key={sectorValue} value={sectorValue}>
                    {employmentSectors[sectorValue]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {employmentSector === "other" && (
            <div>
              <label>
                <span>If other, please describe</span>
                <input
                  type="text"
                  value={empSectorExplain}
                  onChange={(evt) => setEmpSectorExplain(evt.target.value)}
                  required={question.required}
                />
              </label>
            </div>
          )}
        </>
      )
    );
  }

  function renderPayInterval(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            required={question.required}
            placeholder={question.placeholder}
            value={payInterval}
            onChange={(evt) => setPayInterval(PayInterval[evt.target.value])}
          >
            {Object.keys(payIntervals).map((payIntervalName) => (
              <option key={payIntervalName} value={payIntervalName}>
                {payIntervals[payIntervalName]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function renderAvgWeeklyHoursWorked(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            required={question.required}
            placeholder={question.placeholder}
            onChange={(evt) =>
              setWeeklyEmployedHours(WeeklyEmployedHours[evt.target.value])
            }
            value={weeklyEmployedHours}
          >
            {Object.keys(WeeklyEmployedHours).map((weeklyHour) => (
              <option key={weeklyHour} value={weeklyHour}>
                {WeeklyEmployedHours[weeklyHour]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function renderCountryOfOrigin(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <CountrySelect
            country={countryOfOrigin}
            setCountry={setCountryOfOrigin}
            required={question.required}
            placeholder={question.placeholder}
          />
        </label>
      </div>
    );
  }

  function renderDateOfUSArrival(question: IntakeQuestion) {
    return (
      countryOfOrigin !== "US" && (
        <div>
          <label>
            <span>{question.label}</span>
            <input
              type={
                window.navigator.userAgent.toLowerCase().includes("firefox")
                  ? "date"
                  : "month"
              }
              required={question.required}
              placeholder={question.placeholder}
              value={dateOfUSArrival}
              onChange={(evt) => setDateOfUSArrival(evt.target.value)}
            />
          </label>
        </div>
      )
    );
  }

  function renderHomeLanguage(question: IntakeQuestion) {
    return (
      <>
        <div>
          <label>
            <span>{question.label}</span>
            <select
              required={question.required}
              name="homeLanguage"
              value={homeLanguage}
              placeholder={question.placeholder}
              onChange={(evt) => setHomeLanguage(evt.target.value)}
            >
              {Object.keys(languageOptions).map((value) => (
                <option key={value} value={value}>
                  {languageOptions[value]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {homeLanguage === "other" && (
          <div>
            <label>
              <span>Other language</span>
              <input
                required={question.required}
                placeholder="Portuguese"
                type="text"
                value={otherLanguage}
                onChange={(evt) => setOtherLanguage(evt.target.value)}
              />
            </label>
          </div>
        )}
      </>
    );
  }

  function renderEnglishLevel(question: IntakeQuestion) {
    return (
      <div>
        <label>
          <span>{question.label}</span>
          <select
            required={question.required}
            placeholder={question.placeholder}
            value={englishLevel}
            onChange={(evt) => setEnglishLevel(evt.target.value)}
          >
            {Object.keys(EnglishLevel).map((englishLevelKey) => (
              <option value={englishLevelKey} key={englishLevelKey}>
                {EnglishLevel[englishLevelKey]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  function handleSubmit(evt) {
    props.onSubmit(evt, demographicInfo);
  }
}

function getInitialEmploymentSector(val) {
  if (val) {
    return Object.keys(employmentSectors).includes(val) ? val : "other";
  } else {
    return employmentSectors.construction;
  }
}

function getInitialOtherEmploymentSector(val) {
  if (val) {
    return Object.keys(employmentSectors).includes(val) ? "" : val;
  } else {
    return "";
  }
}

function getInitialHomeLanguage(val, isNewClient) {
  if (val) {
    return Object.keys(languageOptions).includes(val) ? val : "other";
  } else if (val === null) {
    return "unknown";
  } else {
    return "spanish";
  }
}

function getInitialOtherHomeLanguage(val) {
  if (val) {
    return Object.keys(languageOptions).includes(val) ? "" : val;
  } else {
    return "";
  }
}

function fullDateOfUSArrival(str) {
  if (!str) {
    return null;
  } else if (
    str.lastIndexOf("-") === str.indexOf("-") &&
    str.indexOf("-") > 0
  ) {
    // We only have month, not day
    return str + "-01";
  } else {
    return str;
  }
}

export const employmentSectors = {
  landscaping: "Landscaping/Gardening",
  construction: "Construction",
  services: "Services (Restaurants, Hotels)",
  dayLaborer: "Day Worker/Laborer",
  domesticWorker: "Domestic Worker",
  industrial: "Industrial/Warehouse",
  agriculture: "Agriculture",
  other: "Other (Explain)",
};

export enum languageOptions {
  english = "English",
  spanish = "Spanish",
  englishandspanish = "English And Spanish",
  unknown = "Unknown",
  other = "Other",
}

export const payIntervals = {
  "every-week": "Every week",
  "every-two-weeks": "Every two weeks",
  "every-month": "Every month",
  "every-quarter": "Every quarter",
  "every-year": "Every year",
};

export enum PayInterval {
  "every-week" = "every-week",
  "every-two-weeks" = "every-two-weeks",
  "every-month" = "every-month",
  "every-quarter" = "every-quarter",
  "every-year" = "every-year",
}

type DemographicInformationInputsProps = {
  client: DemographicInformationClient;
  onSubmit(evt: any, demographicInfo: DemographicInformationClient): any;
  children(
    demographicInfo: DemographicInformationClient
  ): JSX.Element | JSX.Element[];
  isNewClient: boolean;
  clientIntakeSettings: ClientIntakeSettings;
};

export type DemographicInformationClient = {
  civilStatus?: CivilStatus;
  householdIncome?: number;
  householdSize?: number;
  juvenileDependents?: number;
  currentlyEmployed?: string;
  weeklyEmployedHours?: WeeklyEmployedHours;
  employmentSector?: string;
  payInterval?: PayInterval;
  countryOfOrigin?: string;
  dateOfUSArrival?: string;
  homeLanguage?: string;
  isStudent?: boolean;
  englishLevel?: string;
  eligibleToVote?: boolean;
  registerToVote?: boolean;
};

export const EnglishLevel = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  unknown: "Unknown",
};

export enum CivilStatus {
  single = "single",
  married = "married",
  commonLawMarriage = "commonLawMarriage",
  divorced = "divorced",
  widowed = "widowed",
  separated = "separated",
  unknown = "unknown",
}

export const civilStatuses = {
  [CivilStatus.single]: "Single",
  [CivilStatus.married]: "Married",
  [CivilStatus.commonLawMarriage]: "Common Law Marriage",
  [CivilStatus.divorced]: "Divorced",
  [CivilStatus.widowed]: "Widowed",
  [CivilStatus.separated]: "Separated",
  [CivilStatus.unknown]: "Unknown",
};

export enum WeeklyEmployedHours {
  "0-20" = "0-20",
  "21-35" = "21-35",
  "36-40" = "36-40",
  "41+" = "41+",
}
