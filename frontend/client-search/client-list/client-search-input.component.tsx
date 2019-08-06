import React from "react";
import ReactDOM from "react-dom";
import { useCss } from "kremling";
import {
  parseSearch,
  SearchParse,
  SearchParseValues,
  deserializeSearch,
  allowedSearchFields,
  serializeSearch
} from "./client-search-dsl.helpers";

export default function ClientSearchInput(props: ClientSearchInputProps) {
  const scope = useCss(css);
  const [showingAdvancedSearch, setShowingAdvancedSearch] = React.useState(
    false
  );
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
        {!showingAdvancedSearch && (
          <>
            <button
              type="button"
              className="secondary"
              disabled={props.disabled}
              onClick={() => setShowingAdvancedSearch(true)}
            >
              Advanced
            </button>
            <button type="submit" className="primary" disabled={props.disabled}>
              Search
            </button>
          </>
        )}
      </form>
      {showingAdvancedSearch &&
        props.advancedSearchRef &&
        ReactDOM.createPortal(
          <form
            className="advanced-search"
            {...scope}
            autoComplete="password"
            onSubmit={handleSubmit}
          >
            <div className="header">
              <h4>Advanced search</h4>
              <div className="caption">
                When searching multiple fields,{" "}
                <span className="bold">all of the fields must match</span>.
              </div>
            </div>
            <div className="advanced-search-fields">
              <div id="advanced-search-name">Client name:</div>
              <input
                aria-labelledby="advanced-search-name"
                type="text"
                value={search.parseResult.parse.name || ""}
                onChange={evt => updateAdvancedSearch("name", evt.target.value)}
              />
              {Object.entries(allowedSearchFields).map(
                ([fieldKey, fieldName]) => (
                  <React.Fragment key={fieldKey}>
                    <div id={"advanced-search-" + fieldKey}>{fieldName}:</div>
                    <input
                      aria-labelledby={"advanced-search-" + fieldKey}
                      type="text"
                      value={search.parseResult.parse[fieldKey] || ""}
                      onChange={evt =>
                        updateAdvancedSearch(fieldKey, evt.target.value)
                      }
                      placeholder={getPlaceholder(fieldKey)}
                    />
                  </React.Fragment>
                )
              )}
            </div>
            <button
              type="button"
              className="secondary"
              disabled={props.disabled}
              onClick={() => setShowingAdvancedSearch(false)}
            >
              Done
            </button>
            <button type="submit" className="primary" disabled={props.disabled}>
              Search
            </button>
          </form>,
          props.advancedSearchRef.current
        )}
    </div>
  );

  function handleChange(evt) {
    dispatchSearch({ type: SearchTypes.newValue, value: evt.target.value });
  }

  function updateAdvancedSearch(fieldKey, value) {
    dispatchSearch({
      type: SearchTypes.newAdvancedValue,
      fieldKey,
      value,
      currentSearch: search.value
    });
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
      parseResult: parseSearch(value)
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

  function getPlaceholder(fieldKey) {
    switch (fieldKey) {
      case "phone":
        return "8015549982";
      default:
        return "";
    }
  }
}

function searchReducer(state: Search, action: SearchAction): Search {
  let parseResult;
  switch (action.type) {
    case SearchTypes.newValue:
      parseResult = parseSearch(action.value);
      return { value: action.value, parseResult };
    case SearchTypes.newAdvancedValue:
      parseResult = parseSearch(action.currentSearch, {
        [action.fieldKey]: action.value
      });
      const newSearchValue = serializeSearch(parseResult.parse);
      return { value: newSearchValue, parseResult };
    default:
      throw Error();
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

& .advanced-search {
  padding: 1.4rem;
}

& .advanced-search h4 {
  margin: 0;
}

& .advanced-search .header {
  margin-bottom: 1.6rem;
}

& .advanced-search-fields {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  grid-gap: .8rem;
  margin-bottom: 1.6rem;
}
`;

enum SearchTypes {
  newValue = "newValue",
  newAdvancedValue = "newAdvancedValue"
}

export type Search = {
  value: string;
  parseResult: SearchParse;
};

type SearchAction = NewValueAction | NewAdvancedValueAction;

type NewValueAction = {
  type: SearchTypes.newValue;
  value: string;
};

type NewAdvancedValueAction = {
  type: SearchTypes.newAdvancedValue;
  fieldKey: string;
  value: string;
  currentSearch: string;
};

type ClientSearchInputProps = {
  initialValue?: string;
  initialValueFromQueryParams?: boolean;
  autoFocus?: boolean;
  performSearch(parseResult: SearchParseValues): any;
  disabled: boolean;
  advancedSearchRef: React.MutableRefObject<HTMLElement>;
};
