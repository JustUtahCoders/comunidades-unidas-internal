import React, { useState, useEffect, useRef } from "react";
import { useCss } from "kremling";
import FuzzySearch from "fuzzy-search";

export default function CityInput(props) {
  const [focused, setFocused] = useState(false);
  const [justBlurred, setJustBlurred] = useState(false);
  const [statesToCities, setStatesToCities] = useState({});
  const [fuzzySearcher, setFuzzySearcher] = useState(null);
  const scope = useCss(css);
  const inputRef = useRef(null);

  useEffect(() => {
    import("./city-data.js")
      .then(m => setStatesToCities(m.citiesForStates))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setFuzzySearcher(
      new FuzzySearch(statesToCities[props.state] || [], ["city"])
    );
  }, [props.state, statesToCities]);

  useEffect(() => {
    if (justBlurred) {
      const timeoutId = setTimeout(() => {
        setJustBlurred(false);
        setFocused(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [justBlurred]);

  return (
    <div
      className="city-input-container"
      {...scope}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    >
      <input
        type="text"
        value={props.city}
        onChange={evt => props.setCity(evt.target.value)}
        required
        ref={inputRef}
        autoComplete="off"
      />
      {renderPopup()}
    </div>
  );

  function renderPopup() {
    if (!focused || !fuzzySearcher || props.city.trim().length === 0) {
      return null;
    }

    const possibleCities = fuzzySearcher.search(props.city).slice(0, 8);

    return (
      <div className="popup">
        <ul>
          {possibleCities.map(possibleCity => (
            <li key={possibleCity.city}>
              <button
                type="button"
                className="unstyled city-button"
                onClick={() => {
                  props.setCity(possibleCity.city);
                  inputRef.current.blur();
                }}
                tabIndex={-1}
                title={possibleCity.city}
              >
                {possibleCity.city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function handleBlur() {
    setTimeout(() => {
      setFocused(false);
    }, 100);
  }
}

const css = `
& .city-input-container {
  position: relative;
}

& .city-button {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
`;
