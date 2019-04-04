import React, { useState } from "react";
import briefcaseIconUrl from "../../icons/148705-essential-collection/svg/briefcase.svg";
import { StepComponentProps, Step } from "./add-client.component";
import CurrencyInput from "../util/currency-input.component";

export default function IncomeInformation(props: StepComponentProps) {
  const [currentlyEmployed, setCurrentlyEmployed] = useState(false);
  const [employmentSector, setEmploymentSector] = useState("");
  const [payInterval, setPayInterval] = useState(PayInterval.BIWEEKLY);
  const [annualIncome, setAnnualIncome] = useState();
  const [houseHoldSize, setHouseHoldSize] = useState("");
  const [dependents, setDependents] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={briefcaseIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Now it's time for employment and income information.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>Currently employed?</span>
            <input
              type="checkbox"
              name="currentlyEmployed"
              checked={currentlyEmployed}
              onChange={evt => setCurrentlyEmployed(evt.target.checked)}
              autoFocus
            />
          </label>
        </div>
        {currentlyEmployed && (
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
                <span>Average hours worked</span>
                <input
                  type="number"
                  value={hoursWorked}
                  onChange={evt => setHoursWorked(evt.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                <span>Approximate annual income</span>
                <CurrencyInput setDollars={setAnnualIncome} />
              </label>
            </div>
            <div>
              <label>
                <span>Household size</span>
                <input
                  type="number"
                  value={houseHoldSize}
                  onChange={evt => setHouseHoldSize(Number(evt.target.value))}
                  required
                />
              </label>
            </div>
            {houseHoldSize > 0 && (
              <div>
                <label>
                  <span># of dependents</span>
                  <input
                    type="number"
                    value={dependents}
                    onChange={evt => setDependents(evt.target.value)}
                    required
                  />
                </label>
              </div>
            )}
          </>
        )}
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.GLOBAL_BACKGROUND)}
          >
            Go back
          </button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    const clientState = currentlyEmployed
      ? {
          currentlyEmployed,
          employmentSector,
          payInterval,
          hoursWorked,
          annualIncome,
          houseHoldSize,
          dependents: houseHoldSize > 0 ? dependents : 0
        }
      : {
          currentlyEmployed
        };

    props.nextStep(Step.CLIENT_SOURCE, clientState);
  }
}

export enum PayInterval {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually"
}
