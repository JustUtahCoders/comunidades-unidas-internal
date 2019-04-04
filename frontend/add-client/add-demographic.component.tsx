import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import demographicIconUrl from "../../icons/148705-essential-collection/svg/resume.svg";
import CountrySelect from "../util/country-select.component";

export default function DemographicInformation(props: StepComponentProps) {
  const [civilStatus, setCivilStatus] = useState(CivilStatus.SINGLE);
  const [annualIncome, setAnnualIncome] = useState();
  const [houseHoldSize, setHouseHoldSize] = useState();
  const [dependents, setDependents] = useState();
  const [currentlyEmployed, setCurrentlyEmployed] = useState("");
  const [hoursWorked, setHoursWorked] = useState();
  const [employmentSector, setEmploymentSector] = useState("");
  const [payInterval, setPayInterval] = useState(PayInterval.BIWEEKLY);
  const [countryOfOrigin, setCountryOfOrigin] = useState("US");
  const [dateUSArrival, setdateUSArrival] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("Spanish");
  const [otherLanguage, setOtherLanguage] = useState("");
  const [englishLevel, setEnglishLevel] = useState(EnglishLevel.INTERMEDIATE);

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
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>Civil status</span>
            <select
              value={civilStatus}
              name="civilStatus"
              onChange={evt => setCivilStatus(evt.target.value)}
              required
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
            <input
              type="number"
              onChange={evt => setAnnualIncome(Number(evt.target.value))}
              required
              min="6000"
              max="100000"
            />
          </label>
        </div>
        <div>
          <label>
            <span>Household size</span>
            <input
              type="number"
              onChange={evt => setHouseHoldSize(Number(evt.target.value))}
              required
              min="1"
              max="20"
            />
          </label>
        </div>
        {houseHoldSize > 0 && (
          <div>
            <label>
              <span># of dependents</span>
              <input
                type="number"
                onChange={evt => setDependents(Number(evt.target.value))}
                required
                min="1"
                max="20"
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Currently employed?</span>
            <select
              value={currentlyEmployed}
              name="currentlyEmployed"
              onChange={evt => setCurrentlyEmployed(evt.target.value)}
              required
            >
              <option>Select One</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="Unknown">Unknown</option>
            </select>
          </label>
        </div>
        {currentlyEmployed == "Yes" && (
          <>
            <div>
              <label>
                <span>Employment sector</span>
                <input
                  type="text"
                  value={employmentSector}
                  onChange={evt => setEmploymentSector(evt.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                <span>Pay interval</span>
                <select
                  required
                  value={payInterval}
                  onChange={evt => setPayInterval(evt.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every two weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (3 months)</option>
                  <option value="annually">Annually (1 year)</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <span>Average weekly hours worked</span>
                <input
                  type="number"
                  onChange={evt => setHoursWorked(Number(evt.target.value))}
                  required
                  min="1"
                  max="168"
                />
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
              autoFocus
            />
          </label>
        </div>
        {countryOfOrigin !== "US" && (
          <div>
            <label>
              <span>Date of U.S. Arrival</span>
              <input
                required
                type="date"
                value={dateUSArrival}
                onChange={evt => setdateUSArrival(evt.target.value)}
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Primary language at home</span>
            <select
              required
              name="primaryLanguage"
              value={primaryLanguage}
              onChange={evt => setPrimaryLanguage(evt.target.value)}
            >
              <option value="spanish">Spanish</option>
              <option value="english">English</option>
              <option value="bothSpanishAndEnglish">Both</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {primaryLanguage === "other" && (
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
            <span>English level</span>
            <select
              required
              value={englishLevel}
              onChange={evt => setEnglishLevel(evt.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.ADD_CONTACT)}
          >
            Go back
          </button>
        </div>
      </form>
    </>
  );
  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.CONFIRM, {
      civilStatus,
      countryOfOrigin,
      dateUSArrival,
      primaryLanguage:
        primaryLanguage === "other" ? otherLanguage : primaryLanguage,
      englishLevel,
      currentlyEmployed,
      employmentSector,
      payInterval,
      hoursWorked,
      annualIncome,
      houseHoldSize,
      dependents
    });
  }
}

export enum CivilStatus {
  SINGLE = "single",
  MARRIED = "married",
  COMMON_LAW_MARRIAGE = "commonLawMarriage",
  DIVORCED = "divorced",
  WIDOWED = "widowed"
}
export enum EnglishLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}
export enum PayInterval {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually"
}
