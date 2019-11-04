import React, { useState } from "react";
import CountrySelect from "../../util/country-select.component";
import CurrencyInput from "../../util/currency-input.component";

export default function DemographicInformationInputs(
  props: DemographicInformationInputsProps
) {
  const [civilStatus, setCivilStatus] = useState<CivilStatus>(
    CivilStatus[props.client.civilStatus] || CivilStatus.single
  );
  const [householdIncome, setHouseholdIncome] = useState(
    props.client.householdIncome
  );
  const [householdSize, setHouseholdSize] = useState(
    props.client.householdSize || 1
  );
  const [juvenileDependents, setJuvenileDependents] = useState(
    props.client.juvenileDependents || 0
  );
  const [currentlyEmployed, setCurrentlyEmployed] = useState(
    props.client.currentlyEmployed || "no"
  );
  const [weeklyEmployedHours, setWeeklyEmployedHours] = useState<
    WeeklyEmployedHours
  >(props.client.weeklyEmployedHours || WeeklyEmployedHours["0-20"]);
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
    props.client.countryOfOrigin || "US"
  );
  const [dateOfUSArrival, setDateOfUSArrival] = useState(
    props.client.dateOfUSArrival || ""
  );
  const [homeLanguage, setHomeLanguage] = useState(
    getInitialHomeLanguage(props.client.homeLanguage)
  );
  const [otherLanguage, setOtherLanguage] = useState(
    getInitialOtherHomeLanguage(props.client.homeLanguage)
  );
  const [isStudent, setIsStudent] = useState(props.client.isStudent || false);
  const [englishLevel, setEnglishLevel] = useState(
    props.client.englishLevel || "intermediate"
  );
  const [eligibleToVote, setEligibleToVote] = useState(
    props.client.eligibleToVote || false
  );
  const [registerToVote, setRegisterToVote] = useState(
    props.client.registerToVote || false
  );

  const demographicInfo: DemographicInformationClient = {
    civilStatus,
    countryOfOrigin,
    dateOfUSArrival: fullDateOfUSArrival(dateOfUSArrival),
    homeLanguage: homeLanguage === "other" ? otherLanguage : homeLanguage,
    englishLevel,
    currentlyEmployed,
    employmentSector:
      employmentSector === "other"
        ? empSectorExplain
        : employmentSector || null,
    payInterval,
    weeklyEmployedHours,
    householdIncome,
    householdSize,
    isStudent,
    eligibleToVote,
    registerToVote,
    juvenileDependents
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="new-password">
      <div>
        <label>
          <span>Civil status</span>
          <select
            value={civilStatus}
            name="civilStatus"
            onChange={evt => setCivilStatus(CivilStatus[evt.target.value])}
            required
            autoFocus
          >
            {Object.keys(civilStatuses).map(statusKey => (
              <option key={statusKey} value={statusKey}>
                {civilStatuses[statusKey]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          <span>Approximate annual income</span>
          <CurrencyInput
            setDollars={setHouseholdIncome}
            initialValue={householdIncome}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <span>Household size dependent on listed income</span>
          <input
            type="number"
            value={householdSize}
            onChange={evt => setHouseholdSize(Number(evt.target.value))}
            required
            min={1}
            max={30}
          />
        </label>
      </div>
      <div>
        <label>
          <span>Number household dependents under age 18</span>
          <input
            type="number"
            value={juvenileDependents}
            onChange={evt => setJuvenileDependents(Number(evt.target.value))}
            required
            min={0}
            max={30}
          />
        </label>
      </div>
      <div>
        <div role="group" aria-labelledby="is-eligible-to-vote">
          <span id="is-eligible-to-vote">Is the client eligible to vote?</span>
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
                  checked={!eligibleToVote}
                />
                Not eligible to vote
              </label>
            </div>
          </div>
        </div>
      </div>
      {eligibleToVote ? (
        <div>
          <div role="group" aria-labelledby="desire-to-register-vote">
            <span id="desire-to-register-vote">
              Would they like to register to vote?
            </span>
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
      ) : (
        <div />
      )}
      <div>
        <div role="group" aria-labelledby="is-student">
          <span id="is-student">Are they a student?</span>
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
                  checked={!isStudent}
                />
                Not student
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label>
          <span>Currently employed?</span>
          <select
            value={currentlyEmployed}
            name="currentlyEmployed"
            onChange={evt => {
              setCurrentlyEmployed(evt.target.value);
              if (evt.target.value !== "yes") {
                setEmploymentSector(getInitialEmploymentSector(null));
                setEmpSectorExplain("");
                setWeeklyEmployedHours(WeeklyEmployedHours["0-20"]);
              }
            }}
            required
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="n/a">Not Applicable</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
      {currentlyEmployed == "yes" && (
        <>
          <div>
            <label>
              <span>Employment sector</span>
              <select
                value={employmentSector}
                name="employmentSector"
                onChange={evt => setEmploymentSector(evt.target.value)}
                required
              >
                {Object.keys(employmentSectors).map(sectorValue => (
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
                  onChange={evt => setEmpSectorExplain(evt.target.value)}
                  required
                />
              </label>
            </div>
          )}
          <div>
            <label>
              <span>Pay interval</span>
              <select
                required
                value={payInterval}
                onChange={evt => setPayInterval(PayInterval[evt.target.value])}
              >
                {Object.keys(payIntervals).map(payIntervalName => (
                  <option key={payIntervalName} value={payIntervalName}>
                    {payIntervals[payIntervalName]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>Average weekly hours worked</span>
              <select
                required
                onChange={evt =>
                  setWeeklyEmployedHours(WeeklyEmployedHours[evt.target.value])
                }
                value={weeklyEmployedHours}
              >
                {Object.keys(WeeklyEmployedHours).map(weeklyHour => (
                  <option key={weeklyHour} value={weeklyHour}>
                    {WeeklyEmployedHours[weeklyHour]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
      <div>
        <label>
          <span>Country of origin</span>
          <CountrySelect
            country={countryOfOrigin}
            setCountry={setCountryOfOrigin}
          />
        </label>
      </div>
      {countryOfOrigin !== "US" && (
        <div>
          <label>
            <span>Approximate date of U.S. arrival</span>
            <input
              type={
                window.navigator.userAgent.toLowerCase().includes("firefox")
                  ? "date"
                  : "month"
              }
              value={dateOfUSArrival}
              onChange={evt => setDateOfUSArrival(evt.target.value)}
            />
          </label>
        </div>
      )}
      <div>
        <label>
          <span>Primary language in home</span>
          <select
            required
            name="homeLanguage"
            value={homeLanguage}
            onChange={evt => setHomeLanguage(evt.target.value)}
          >
            {Object.keys(languageOptions).map(value => (
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
              required
              type="text"
              value={otherLanguage}
              onChange={evt => setOtherLanguage(evt.target.value)}
            />
          </label>
        </div>
      )}
      <div>
        <label>
          <span>English skill level</span>
          <select
            required
            value={englishLevel}
            onChange={evt => setEnglishLevel(evt.target.value)}
          >
            {Object.keys(EnglishLevel).map(englishLevelKey => (
              <option value={englishLevelKey} key={englishLevelKey}>
                {EnglishLevel[englishLevelKey]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {props.children(demographicInfo)}
    </form>
  );

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

function getInitialHomeLanguage(val) {
  if (val) {
    return Object.keys(languageOptions).includes(val) ? val : "other";
  } else {
    return languageOptions.spanish;
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
  other: "Other (Explain)"
};

export enum languageOptions {
  english = "English",
  spanish = "Spanish",
  englishandspanish = "English And Spanish",
  other = "Other"
}

export const payIntervals = {
  "every-week": "Every week",
  "every-two-weeks": "Every two weeks",
  "every-month": "Every month",
  "every-quarter": "Every quarter",
  "every-year": "Every year"
};

export enum PayInterval {
  "every-week" = "every-week",
  "every-two-weeks" = "every-two-weeks",
  "every-month" = "every-month",
  "every-quarter" = "every-quarter",
  "every-year" = "every-year"
}

type DemographicInformationInputsProps = {
  client: DemographicInformationClient;
  onSubmit(evt: any, demographicInfo: DemographicInformationClient): any;
  children(
    demographicInfo: DemographicInformationClient
  ): JSX.Element | JSX.Element[];
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
  advanced: "Advanced"
};

export enum CivilStatus {
  single = "single",
  married = "married",
  commonLawMarriage = "commonLawMarriage",
  divorced = "divorced",
  widowed = "widowed",
  separated = "separated"
}

export const civilStatuses = {
  [CivilStatus.single]: "Single",
  [CivilStatus.married]: "Married",
  [CivilStatus.commonLawMarriage]: "Common Law Marriage",
  [CivilStatus.divorced]: "Divorced",
  [CivilStatus.widowed]: "Widowed",
  [CivilStatus.separated]: "Separated"
};

export enum WeeklyEmployedHours {
  "0-20" = "0-20",
  "21-35" = "21-35",
  "36-40" = "36-40",
  "41+" = "41+"
}
