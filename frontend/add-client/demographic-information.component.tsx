import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import demographicIconUrl from "../../icons/148705-essential-collection/svg/resume.svg";
import CountrySelect from "../util/country-select.component";
import CurrencyInput from "../util/currency-input.component";

export default function DemographicInformation(props: StepComponentProps) {
  const [civilStatus, setCivilStatus] = useState(CivilStatus.SINGLE);
  const [annualIncome, setAnnualIncome] = useState();
  const [houseHoldSize, setHouseHoldSize] = useState();
  const [dependents, setDependents] = useState();
  const [currentlyEmployed, setCurrentlyEmployed] = useState("");
  const [hoursWorked, setHoursWorked] = useState();
  const [employmentSector, setEmploymentSector] = useState("");
  const [empSectorExplain, setEmpSectorExplain] = useState("");
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
            <CurrencyInput setDollars={setAnnualIncome} required />
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
              max="30"
            />
          </label>
        </div>
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
                <select
                  value={employmentSector}
                  name="cmploymentSector"
                  onChange={evt => setEmploymentSector(evt.target.value)}
                  required
                >
                  <option>Select one</option>
                  <option value="Landscaping">Landscaping/Gardening</option>
                  <option value="Construction">Construction</option>
                  <option value="Services">
                    Services (Restaurants, Hotels)
                  </option>
                  <option value="Day Laborer">Day Worker/Laborer</option>
                  <option value="Domestic Worker">Domestic Worker</option>
                  <option value="Industrial/Warehouse">
                    Industrial/Warehouse
                  </option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other (Explain)</option>
                </select>
              </label>
            </div>
            {employmentSector == "Other" && (
              <div>
                <label>
                  <span>If other, please describe</span>
                  <input
                    type="text"
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
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">Every two weeks</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly (3 months)</option>
                  <option value="Annually">Annually (1 year)</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <span>Average weekly hours worked</span>
                <select
                  required
                  onChange={evt => setHoursWorked(evt.target.value)}
                >
                  <option>Select one</option>
                  <option value="20 or less">20 or less</option>
                  <option value="21 to 35">21 to 35</option>
                  <option value="36 to 40">36 to 40</option>
                  <option value="41 or more">41 or more</option>
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
              <option value="english-and-spanish">English and Spanish</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {primaryLanguage === "Other" && (
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
              onChange={evt => setEnglishLevel(EnglishLevel[evt.target.value])}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.CONTACT_INFORMATION)}
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
    props.nextStep(Step.SERVICES, {
      civilStatus,
      countryOfOrigin,
      dateUSArrival,
      primaryLanguage:
        primaryLanguage === "other" ? otherLanguage : primaryLanguage,
      englishLevel,
      currentlyEmployed,
      employmentSector:
        employmentSector === "Other" ? empSectorExplain : employmentSector,
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
