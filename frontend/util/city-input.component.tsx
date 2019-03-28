import React, {useState, useEffect, useRef} from 'react'
import {useCss, always, maybe} from 'kremling'
import FuzzySearch from 'fuzzy-search'

export default function CityInput(props) {
  const [focused, setFocused] = useState(false)
  const [statesToCities, setStatesToCities] = useState({})
  const [fuzzySearcher, setFuzzySearcher] = useState(null)
  const scope = useCss(css)
  const inputRef = useRef(null)

  useEffect(() => {
    import('./city-data.js').then(m => setStatesToCities(m.citiesForStates)).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setFuzzySearcher(new FuzzySearch(statesToCities[props.state] || [], ['city']))
  }, [props.state, statesToCities])

  return (
    <div className="city-input-container" {...scope} onFocus={() => setFocused(true)} onBlur={handleBlur}>
      <input type="text" value={props.city} onChange={evt => props.setCity(evt.target.value)} required ref={inputRef} />
      {renderPopup()}
    </div>
  )

  function renderPopup() {
    if (!focused || !fuzzySearcher || props.city.trim().length === 0) {
      return null
    }

    const possibleCities = fuzzySearcher.search(props.city).slice(0, 8)

    return (
      <div className={always("popup").maybe('hidden', possibleCities.length === 0)}>
        <ul>
        {possibleCities.map(possibleCity => (
          <li key={possibleCity.city}>
            <button type="button" className="unstyled" onClick={() => {
              props.setCity(possibleCity.city)
              inputRef.current.blur()
            }}>
              {possibleCity.city}
            </button>
          </li>
        ))}
        </ul>
      </div>
    )
  }

  function handleBlur() {
    setTimeout(() => {
      setFocused(false)
    }, 100)
  }
}

const css = `
& .city-input-container {
  position: relative;
}
`