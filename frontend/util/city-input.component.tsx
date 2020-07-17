import React, { useState, useEffect, useRef } from "react";
import { useCss, m } from "kremling";
import FuzzySearch from "fuzzy-search";

export default function CityInput(props: CityInputProps) {
  const [focused, setFocused] = useState(false);
  const [justBlurred, setJustBlurred] = useState(false);
  const [statesToCities, setStatesToCities] = useState({});
  const [fuzzySearcher, setFuzzySearcher] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scope = useCss(css);
  const inputRef = useRef(null);

  useEffect(() => {
    import("./city-data.js")
      .then((m) => setStatesToCities(m.citiesForStates))
      .catch((err) =>
        setTimeout(() => {
          throw err;
        })
      );
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
        onChange={(evt) => props.setCity(evt.target.value)}
        required={props.required}
        ref={inputRef}
        autoComplete="new-password"
        onFocus={() => setSelectedIndex(0)}
        onKeyDown={onKeyDown}
      />
      {renderPopup()}
    </div>
  );

  function setCityAndTab(city) {
    props.setCity(city);
    props.nextInputRef.current.focus();
  }

  function onKeyDown(evt) {
    const possibleCities = fuzzySearcher.search(props.city).slice(0, 8);
    if (evt.key === "Enter") {
      evt.preventDefault();
      setCityAndTab(possibleCities[selectedIndex].city);
    } else if (evt.key === "ArrowDown") {
      setSelectedIndex(
        possibleCities.length - 1 === selectedIndex ? 0 : selectedIndex + 1
      );
    } else if (evt.key === "ArrowUp") {
      setSelectedIndex(
        selectedIndex === 0 ? possibleCities.length - 1 : selectedIndex - 1
      );
    } else {
      setSelectedIndex(0);
    }
  }

  function renderPopup() {
    if (!focused || !fuzzySearcher || props.city.trim().length === 0) {
      return null;
    }

    const possibleCities = fuzzySearcher.search(props.city).slice(0, 8);

    return (
      <div className="popup">
        <ul>
          {possibleCities.map((possibleCity, i) => (
            <li
              key={possibleCity.city}
              className={m("selected-index", selectedIndex === i)}
            >
              <button
                type="button"
                className="unstyled city-button"
                tabIndex={-1}
                title={possibleCity.city}
                onClick={() => setCityAndTab(possibleCity.city)}
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

type CityInputProps = {
  state: string;
  city: string;
  setCity(city: string): any;
  nextInputRef: React.RefObject<any>;
  required: boolean;
};

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

& .selected-index {
  background-color: darkgray;
}
`;
