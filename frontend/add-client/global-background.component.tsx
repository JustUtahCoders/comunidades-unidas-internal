import React, { useState } from "react";
import globeIconUrl from "../../icons/148705-essential-collection/svg/worldwide.svg";
import CountrySelect from "../util/country-select.component";
import { StepComponentProps, Step } from "./add-client.component";

export default function GlobalBackground(props: StepComponentProps) {
  const [countryOfOrigin, setCountryOfOrigin] = useState("US");
  const [dateUSArrival, setdateUSArrival] = useState("1990-01-01");
  const [primaryLanguage, setPrimaryLanguage] = useState("Spanish");
  const [otherLanguage, setOtherLanguage] = useState("");
  const [englishLevel, setEnglishLevel] = useState(EnglishLevel.INTERMEDIATE);

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={globeIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Tell us about their country of origin and language skills.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
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
            <span>
              Years in U.S.A.
            </span>
            <input required type="number" value={numYearsInUSA} onChange={evt => setNumYearsInUSA(Number(evt.target.value))} />
          </label>
        </div>
        <div>
          <label>
            <span>
              Registered to vote?
            </span>
            <input type="checkbox" name="registeredToVote" checked={registeredToVote} onChange={evt => setRegisteredToVote(Boolean(evt.target.checked))} />
          </label>
        </div>
        <div>
          <label>
            <span>
              Primary language at home
            </span>
            <select required name="primaryLanguage" value={primaryLanguage} onChange={evt => setPrimaryLanguage(evt.target.value)}>
              <option value="spanish">
                Spanish
              </option>
              <option value="english">
                English
              </option>
              <option value="bothSpanishAndEnglish">
                English and Spanish
              </option>
              <option value="other">
                Other
              </option>
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
<<<<<<< HEAD
            <span>English level</span>
            <select
              required
              value={englishLevel}
              onChange={evt => setEnglishLevel(evt.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
=======
            <span>
              English level
            </span>
            <select required value={englishLevel} onChange={evt => setEnglishLevel(EnglishLevel[evt.target.value])}>
              <option value="beginner">
                Beginner
              </option>
              <option value="intermediate">
                Intermediate
              </option>
              <option value="advanced">
                Advanced
              </option>
>>>>>>> master
            </select>
          </label>
        </div>
        <div className="actions">
<<<<<<< HEAD
          <button type="submit" className="primary">
            Next step
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.PERSONAL_INFORMATION)}
          >
=======
          <button type="button" className="secondary" onClick={() => props.goBack(Step.PERSONAL_INFORMATION)}>
>>>>>>> master
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
    props.nextStep(Step.INCOME_INFORMATION, {
      countryOfOrigin,
      dateUSArrival,
      primaryLanguage:
        primaryLanguage === "other" ? otherLanguage : primaryLanguage,
      englishLevel
    });
  }
}

export enum EnglishLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}
