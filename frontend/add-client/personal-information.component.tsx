import React, {useState} from 'react'
import {StepComponentProps, Step} from './add-client.component'
import successIconUrl from '../../icons/148705-essential-collection/svg/success.svg'
import PhoneInput from '../util/phone-input.component'
import StateSelect from '../util/state-select.component'

export default function PersonalInformation(props: StepComponentProps) {
  const [gender, setGender] = useState('female')
  const [genderExplanation, setGenderExplanation] = useState('')
  const [civilStatus, setCivilStatus] = useState(CivilStatus.SINGLE)
  const [phone, setPhone] = useState('')
  const [smsConsent, setSmsConsent] = useState(false)
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('UT')
  const [zip, setZip] = useState('')
  const [email, setEmail] = useState('')

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={successIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Great! This person is not yet in the system. Let's add their personal information.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>
              First Name
            </span>
            <input type="text" value={props.clientState.firstName} required disabled />
          </label>
        </div>
        <div>
          <label>
            <span>
              Last Name
            </span>
            <input type="text" value={props.clientState.lastName} required disabled />
          </label>
        </div>
        <div>
          <label>
            <span>
              Birthday
            </span>
            <input type="date" value={props.clientState.birthday} required disabled />
          </label>
        </div>
        <div>
          <label>
            <span>
              Gender
            </span>
            <select value={gender} onChange={evt => setGender(evt.target.value)} required autoFocus>
              <option value="female">
                Female
              </option>
              <option value="male">
                Male
              </option>
              <option value="transgender">
                Transgender
              </option>
              <option value="other">
                Other (please explain)
              </option>
            </select>
          </label>
        </div>
        {gender === 'other' &&
          <div>
            <label>
              <span>
                Explanation
              </span>
              <textarea value={genderExplanation} onChange={evt => setGenderExplanation(evt.target.value)} required />
            </label>
          </div>
        }
        <div>
          <label>
            <span>
              Civil status
            </span>
            <select value={civilStatus} name="civilStatus" onChange={evt => setCivilStatus(CivilStatus[evt.target.value])} required>
              <option value="single">
                Single
              </option>
              <option value="married">
                Married
              </option>
              <option value="commonLawMarriage">
                Common law marriage (unión libre)
              </option>
              <option value="divorced">
                Divorced
              </option>
              <option value="widowed">
                Widowed
              </option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <span>
              Phone number
            </span>
            <PhoneInput phone={phone} setPhone={setPhone} />
          </label>
        </div>
        <div>
          <label>
            <span>
              Wants text messages
            </span>
            <input type="checkbox" name="smsConsent" checked={smsConsent} onChange={evt => setSmsConsent(Boolean(evt.target.checked))} />
          </label>
        </div>
        <div>
          <label>
            <span>
              Street Address
            </span>
            <input type="text" value={streetAddress} onChange={evt => setStreetAddress(evt.target.value)} required placeholder="1211 W. 3200 S." />
          </label>
        </div>
        <div>
          <label>
            <span>
              City
            </span>
            <input type="text" value={city} onChange={evt => setCity(evt.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            <span>
              State
            </span>
            <StateSelect state={state} setState={setState} />
          </label>
        </div>
        <div>
          <label>
            <span>
              ZIP Code
            </span>
            <input type="text" value={zip} onChange={evt => setZip(evt.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            <span>
              Email
            </span>
            <input type="email" value={email} onChange={evt => setEmail(evt.target.value)} required />
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button type="button" className="secondary" onClick={() => props.goBack(Step.CHECK_DUPLICATE)}>
            Go back
          </button>
        </div>
      </form>
    </>
  )

  function handleSubmit(evt) {
    evt.preventDefault()
    props.nextStep(Step.GLOBAL_BACKGROUND, {
      gender: Gender[gender],
      genderExplanation: gender === 'other' ? genderExplanation : null,
      civilStatus,
      phone,
      smsConsent,
      streetAddress,
      city,
      state,
      zip,
      email,
    })
  }
}

export enum Gender {
  FEMALE = "female",
  MALE = "male",
  TRANSGENDER = "transgender",
  OTHER = "other",
}

export enum CivilStatus {
  SINGLE = "single",
  MARRIED = "married",
  COMMON_LAW_MARRIAGE = "commonLawMarriage",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
}