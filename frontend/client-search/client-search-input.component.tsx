import React from "react";
import { useCss } from "kremling";
import {
  parseSearch,
  SearchParse,
  SearchParseValues
} from "./client-search-dsl.helpers";

export default function ClientSearchInput(props: ClientSearchInputProps) {
  const scope = useCss(css);
  const [search, dispatchSearch] = React.useReducer(
    searchReducer,
    getInitialSearch()
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="search-container" {...scope}>
      <form
        autoComplete="new-password"
        onSubmit={handleSubmit}
        className="search-form"
      >
        <input
          type="text"
          value={search.value}
          onChange={handleChange}
          className="search-input"
          autoFocus={props.autoFocus}
          ref={inputRef}
        />
        <button type="submit" className="primary" disabled={props.disabled}>
          Search
        </button>
      </form>
    </div>
  );

  function handleChange(evt) {
    dispatchSearch({ type: SearchTypes.newValue, value: evt.target.value });
  }

  function getInitialSearch(): Search {
    const value = props.initialValue || "";

    return {
      value,
      parseResult: {
        isValid: true,
        errors: [],
        parse: {
          name: ""
        }
      }
    };
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (search.parseResult.isValid) {
      props.performSearch(search.parseResult.parse);
    } else {
      inputRef.current.setCustomValidity(search.parseResult.errors.join(", "));
    }
  }
}

function searchReducer(state: Search, action: SearchAction): Search {
  switch (action.type) {
    case SearchTypes.newValue:
      const parseResult = parseSearch(action.value);
      return { value: action.value, parseResult };
  }
}

const css = `
& .search-container {
  display: flex;
  align-items: center;
  width: 100%;
}

& .search-input {
  width: 100%;
  margin-right: 1.6rem;
}

& .search-form {
  display: flex;
  align-items: center;
  width: 100%;
}
`;

enum SearchTypes {
  newValue = "newValue"
}

export type Search = {
  value: string;
  parseResult: SearchParse;
};

type SearchAction = NewValueAction;

type NewValueAction = {
  type: SearchTypes;
  value: string;
};

type ClientSearchInputProps = {
  initialValue?: string;
  autoFocus?: boolean;
  performSearch(parseResult: SearchParseValues): any;
  disabled: boolean;
};
