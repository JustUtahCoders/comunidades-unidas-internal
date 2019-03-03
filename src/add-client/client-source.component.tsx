import React, {useState} from 'react'
import {StepComponentProps, Step} from './add-client.component'
import targetIconUrl from '../../icons/148705-essential-collection/svg/target.svg'

export default function ClientSource(props: StepComponentProps) {
  const [clientSource, setClientSource] = useState('')
  const [otherSource, setOtherSource] = useState('')
  const [couldVolunteer, setCouldVolunteer] = useState(false)

  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={targetIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Let's track how this client heard of us.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>
              How did they hear about Comunidades Unidas
            </span>
            <select value={clientSource} onChange={evt => setClientSource(evt.target.value)} autoFocus required>
              <option value="facebook">
                Facebook
              </option>
              <option value="instagram">
                Instagram
              </option>
              <option value="website">
                Website
              </option>
              <option value="promotionalMaterial">
                Promotional Material
              </option>
              <option value="consulate">
                Consulate
              </option>
              <option value="friend">
                Friend
              </option>
              <option value="previousClient">
                Comunidades Unidas client
              </option>
              <option value="employee">
                Comunidades Unidas employee
              </option>
              <option value="sms">
                Text message
              </option>
              <option value="radio">
                Radio
              </option>
              <option value="tv">
                TV
              </option>
              <option value="other">
                Other
              </option>
            </select>
          </label>
        </div>
        {clientSource === 'other' &&
          <div>
            <label>
              <span>
                Other source
              </span>
              <input type="text" value={otherSource} onChange={evt => setOtherSource(evt.target.value)} required />
            </label>
          </div>
        }
        <div>
          <label>
            <span>
              Would they like to volunteer for Comunidades Unidas?
            </span>
            <input type="checkbox" name="couldVolunteer" checked={couldVolunteer} onChange={evt => setCouldVolunteer(Boolean(evt.target.checked))} />
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="primary">
            Next step
          </button>
          <button type="button" className="secondary" onClick={() => props.goBack(Step.INCOME_INFORMATION)}>
            Go back
          </button>
        </div>
      </form>
    </>
  )

  function handleSubmit(evt) {
    evt.preventDefault()
    props.nextStep(Step.SERVICES, {
      clientSource: clientSource === 'other' ? otherSource : clientSource,
      couldVolunteer,
    })
  }
}