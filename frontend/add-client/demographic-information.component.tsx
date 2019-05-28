import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import demographicIconUrl from "../../icons/148705-essential-collection/svg/resume.svg";
import CountrySelect from "../util/country-select.component";
import CurrencyInput from "../util/currency-input.component";

export default function DemographicInformation(props: StepComponentProps) {
  const [civilStatus, setCivilStatus] = useState(CivilStatus.SINGLE);
  const [householdIncome, setHouseholdIncome] = useState(
    props.clientState.householdIncome
  );
  const [householdSize, setHouseholdSize] = useState(
    props.clientState.householdSize || 1
  );
  const [juvenileDependents, setJuvenileDependents] = useState(
    props.clientState.juvenileDependents || 0
  );
  const [currentlyEmployed, setCurrentlyEmployed] = useState(
    props.clientState.currentlyEmployed || "no"
  );
  const [weeklyEmployedHours, setWeeklyEmployedHours] = useState(
    props.clientState.weeklyEmployedHours || ""
  );
  const [employmentSector, setEmploymentSector] = useState(
    getInitialEmploymentSector(props.clientState.employmentSector)
  );
  const [empSectorExplain, setEmpSectorExplain] = useState(
    getInitialOtherEmploymentSector(props.clientState.employmentSector)
  );
  const [payInterval, setPayInterval] = useState(
    props.clientState.payInterval || PayInterval["every-two-weeks"]
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    props.clientState.countryOfOrigin || "US"
  );
  const [dateOfUSArrival, setDateOfUSArrival] = useState(
    props.clientState.dateOfUSArrival || ""
  );
  const [homeLanguage, setHomeLanguage] = useState(
    getInitialHomeLanguage(props.clientState.homeLanguage)
  );
  const [otherLanguage, setOtherLanguage] = useState(
    getInitialOtherHomeLanguage(props.clientState.homeLanguage)
  );
  const [isStudent, setIsStudent] = useState(
    props.clientState.isStudent || false
  );
  const [englishLevel, setEnglishLevel] = useState(
    props.clientState.englishLevel || EnglishLevel.intermediate
  );
  const [eligibleToVote, setEligibleToVote] = useState(
    props.clientState.eligibleToVote || false
  );
  const [registerToVote, setRegisterToVote] = useState(
    props.clientState.registerToVote || false
  );

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={demographicIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Almost done, now add demographic information for{" "}
          <strong>
            {props.clientState.firstName} {props.clientState.lastName}
          </strong>
          .
        </div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
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
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="commonLawMarriage">
                Common law marriage (unión libre)
              </option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
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
              min="1"
              max="30"
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
          <label>
            <span>Is the client eligible to vote?</span>
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
                    onChange={() => setEligibleToVote(false)}
                    checked={!eligibleToVote}
                  />
                  Not eligible to vote
                </label>
              </div>
            </div>
          </label>
        </div>
        {eligibleToVote ? (
          <div>
            <label>
              <span>Would they like to register to vote?</span>
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
            </label>
          </div>
        ) : (
          <div />
        )}
        <div>
          <label>
            <span>Are they a student?</span>
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
          </label>
        </div>
        <div>
          <label>
            <span>Currently employed?</span>
            <select
              value={currentlyEmployed}
              name="currentlyEmployed"
              onChange={evt => setCurrentlyEmployed(evt.target.value)}
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
                <span>Type of employment</span>
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
                  onChange={evt =>
                    setPayInterval(PayInterval[evt.target.value])
                  }
                >
                  <option value="every-week">Weekly</option>
                  <option value="every-two-weeks">Every two weeks</option>
                  <option value="every-month">Monthly</option>
                  <option value="every-quarter">Quarterly (3 months)</option>
                  <option value="every-year">Annually (1 year)</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <span>Average weekly hours worked</span>
                <select
                  required
                  onChange={evt => setWeeklyEmployedHours(evt.target.value)}
                  value={weeklyEmployedHours}
                >
                  <option value="0-20">20 or less</option>
                  <option value="21-35">21 to 35</option>
                  <option value="36-40">36 to 40</option>
                  <option value="41+">41 or more</option>
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
                required
                type="date"
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
              onChange={evt => setEnglishLevel(EnglishLevel[evt.target.value])}
            >
              {Object.keys(EnglishLevel).map(englishLevelKey => (
                <option value={englishLevelKey}>
                  EnglishLevel[englishLevelKey
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() =>
              props.goBack(Step.CONTACT_INFORMATION, {
                civilStatus,
                countryOfOrigin,
                dateOfUSArrival,
                primaryLanguage:
                  homeLanguage === "other" ? otherLanguage : homeLanguage,
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
                eligibleToVote
              })
            }
          >
            Go back
          </button>
          <button type="submit" className="primary">
            Next step
          </button>
        </div>
      </form>
    </>
  );
  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.CLIENT_SOURCE, {
      civilStatus,
      countryOfOrigin,
      dateOfUSArrival,
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
      juvenileDependents,
      isStudent,
      eligibleToVote
    });
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

const employmentSectors = {
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

export enum CivilStatus {
  SINGLE = "single",
  MARRIED = "married",
  COMMON_LAW_MARRIAGE = "commonLawMarriage",
  DIVORCED = "divorced",
  WIDOWED = "widowed"
}
export enum EnglishLevel {
  beginner = "Beginner",
  intermediate = "Intermediate",
  advanced = "Advanced"
}

export enum PayInterval {
  "every-week" = "every-week",
  "every-two-weeks" = "every-two-weeks",
  "every-month" = "every-month",
  "every-quarter" = "every-quarter",
  "every-year" = "every-year"
}
