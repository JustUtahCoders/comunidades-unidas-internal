import React, {useState} from 'react'
import {StepComponentProps, Step} from './add-client.component'
import agendaIconUrl from '../../icons/148705-essential-collection/svg/agenda.svg'

export default function Services(props: StepComponentProps) {
  const [services, setServices] = useState(defaultServices)

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={agendaIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          What can Comunidades Unidas do for this person?
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>
              Comunidades Unidas Services
            </span>
            <div className="vertical-options">
              <label>
                <input type="checkbox" name="services" value="citizenship" checked={services.citizenship} onChange={handleChange} autoFocus />
                <span>Citizenship</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="familyPetition" checked={services.familyPetition} onChange={handleChange} />
                <span>Family Petition</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="workersRightsAndSafety" checked={services.workersRightsAndSafety} onChange={handleChange} />
                <span>Workers' Rights and Safety</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="DACA" checked={services.DACA} onChange={handleChange} />
                <span>DACA</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="leadershipClasses" checked={services.leadershipClasses} onChange={handleChange} />
                <span>Leadership classes</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="foodStamps" checked={services.foodStamps} onChange={handleChange} />
                <span>Food stamps</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="chronicDiseaseTesting" checked={services.chronicDiseaseTesting} onChange={handleChange} />
                <span>Chronic disease testing</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="nutrition" checked={services.nutrition} onChange={handleChange} />
                <span>Nutrition</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="groceries" checked={services.groceries} onChange={handleChange} />
                <span>Groceries</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="cookingClasses" checked={services.cookingClass} onChange={handleChange} />
                <span>Cooking classes</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="PrEPClinic" checked={services.PrEPClinic} onChange={handleChange} />
                <span>PrEP clinic referral</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="legalHelp" checked={services.legalHelp} onChange={handleChange} />
                <span>Community organization / Legal help</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="financialCoaching" checked={services.financialCoaching} onChange={handleChange} />
                <span>Financial coaching</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="itinRenewal" checked={services.itinRenewal} onChange={handleChange} />
                <span>ITIN Renewal</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="VITA" checked={services.VITA} onChange={handleChange} />
                <span>VITA Tax help</span>
              </label>
              <label>
                <input type="checkbox" name="services" value="voterRegistration" checked={services.voterRegistration} onChange={handleChange} />
                <span>Voter registration</span>
              </label>
            </div>
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button type="button" className="secondary" onClick={() => props.goBack(Step.CLIENT_SOURCE)}>
            Go back
          </button>
        </div>
      </form>
    </>
  )

  function handleChange(evt) {
    console.log(evt.target, evt.target.name, evt.target.checked)
    setServices({...services, [evt.target.value]: evt.target.checked})
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    props.nextStep(Step.FINISHED, {})
  }
}

const defaultServices = {
  citizenship: false,
  familyPetition: false,
  workersRightsAndSafety: false,
  DACA: false,
  leadershipClasses: false,
  foodStamps: false,
  chronicDiseaseTesting: false,
  nutrition: false,
  groceries: false,
  cookingClass: false,
  PrEPClinic: false,
  legalHelp: false,
  financialCoaching: false,
  itinRenewal: false,
  VITA: false,
  voterRegistration: false,
}