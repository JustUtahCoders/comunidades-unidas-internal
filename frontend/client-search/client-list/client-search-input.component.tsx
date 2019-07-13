import React from "react";
import { useCss } from "kremling";
import {
  parseSearch,
  SearchParse,
  SearchParseValues,
  deserializeSearch
} from "./client-search-dsl.helpers";

export default function ClientSearchInput(props: ClientSearchInputProps) {
  const scope = useCss(css);
  const [search, dispatchSearch] = React.useReducer(
    searchReducer,
    getInitialSearch()
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current.setCustomValidity(search.parseResult.errors.join(", "));
  }, [search]);

  return (
    <div className="search-container" {...scope}>
      <form
        autoComplete="new-password"
        onSubmit={handleSubmit}
        className="search-form"
      >
        <input
          type="search"
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
    let value: string;
    if (props.initialValueFromQueryParams) {
      value = deserializeSearch();
    } else {
      value = props.initialValue || "";
    }

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
      return false;
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
  initialValueFromQueryParams?: boolean;
  autoFocus?: boolean;
  performSearch(parseResult: SearchParseValues): any;
  disabled: boolean;
};
