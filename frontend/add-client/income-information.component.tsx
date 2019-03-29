import React, {useState} from 'react'
import briefcaseIconUrl from '../../icons/148705-essential-collection/svg/briefcase.svg'
import {StepComponentProps, Step} from './add-client.component'
import CurrencyInput from '../util/currency-input.component'

export default function IncomeInformation(props: StepComponentProps) {
  const [currentlyEmployed, setCurrentlyEmployed] = useState(false)
  const [profession, setProfession] = useState('')
  const [payPeriod, setPayPeriod] = useState(PayPeriod.BIWEEKLY)
  const [yearlyIncome, setYearlyIncome] = useState()
  const [numDependents, setNumDependents] = useState(0)
  const [numMinorDependents, setNumMinorDependents] = useState(0)

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
            <span>
              Currently employed?
            </span>
            <input type="checkbox" name="currentlyEmployed" checked={currentlyEmployed} onChange={evt => setCurrentlyEmployed(evt.target.checked)} autoFocus />
          </label>
        </div>
        {currentlyEmployed &&
          <>
            <div>
              <label>
                <span>
                  Profession
                </span>
                <input type="text" value={profession} onChange={evt => setProfession(evt.target.value)} required />
              </label>
            </div>
            <div>
              <label>
                <span>
                  Pay period
                </span>
                <select required value={payPeriod} onChange={evt => setPayPeriod(PayPeriod[evt.target.value])}>
                  <option value="weekly">
                    Weekly
                  </option>
                  <option value="biweekly">
                    Every two weeks
                  </option>
                  <option value="monthly">
                    Monthly
                  </option>
                  <option value="quarterly">
                    Quarterly (3 months)
                  </option>
                  <option value="annually">
                    Annually (1 year)
                  </option>
                </select>
              </label>
            </div>
            <div>
              <label>
                <span>
                  Approximate yearly income
                </span>
                <CurrencyInput setDollars={setYearlyIncome} />
              </label>
            </div>
            <div>
              <label>
                <span>
                  # of dependents
                </span>
                <input type="number" value={numDependents} onChange={evt => setNumDependents(Number(evt.target.value))} required />
              </label>
            </div>
            {numDependents > 0 &&
              <div>
                <label>
                  <span>
                    # of dependents younger than 18
                  </span>
                  <input type="number" value={numMinorDependents} onChange={evt => setNumMinorDependents(Number(evt.target.value))} required />
                </label>
              </div>
            }
          </>
        }
        <div className="actions">
          <button type="button" className="secondary" onClick={() => props.goBack(Step.GLOBAL_BACKGROUND)}>
            Go back
          </button>
          <button type="submit" className="primary">
            Next step
          </button>
        </div>
      </form>
    </>
  )

  function handleSubmit(evt) {
    evt.preventDefault()
    const clientState = currentlyEmployed
      ?
        {
          currentlyEmployed,
          profession,
          payPeriod,
          yearlyIncome,
          numDependents,
          numMinorDependents: numDependents > 0 ? numMinorDependents : 0,
        }
      :
        {
          currentlyEmployed
        }

    props.nextStep(Step.CLIENT_SOURCE, clientState)
  }
}

export enum PayPeriod {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}