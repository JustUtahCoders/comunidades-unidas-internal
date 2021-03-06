import React, { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";
import { useCss } from "kremling";
import {
  parseSearch,
  SearchParse,
  SearchParseValues,
  deserializeSearch,
  serializeSearch,
} from "../../util/list-search/search-dsl.helpers";
import easyFetch from "../../util/easy-fetch";
import ProgramOrService from "./program-or-service.component";

const searchFields = {
  id: "Client ID",
  zip: "ZIP Code",
  phone: "Phone",
  programInterest: "Interest",
  serviceInterest: "Interest",
  programInteraction: "Program Received",
  programStartInteraction: "Start",
  programEndInteraction: "Start",
  serviceInteraction: "Service Received",
  serviceStartInteraction: "Start",
  serviceEndInteraction: "End",
};

export default function ClientSearchInput(props: ClientSearchInputProps) {
  const scope = useCss(css);
  const [search, dispatchSearch] = React.useReducer(
    searchReducer,
    getInitialSearch(searchFields)
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [serviceData, setServiceData] = React.useState([]);

  React.useEffect(() => {
    inputRef.current.setCustomValidity(search.parseResult.errors.join(", "));
  }, [search]);

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/services`, { signal: abortController.signal })
      .then(setServiceData)
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

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
          aria-label="Search for clients"
          placeholder="Search for clients"
        />
        {!props.advancedSearchOpen && (
          <>
            <button
              type="button"
              className="secondary"
              disabled={props.disabled}
              onClick={() => props.setAdvancedSearchOpen(true)}
            >
              Advanced
            </button>
            <button type="submit" className="primary" disabled={props.disabled}>
              Search
            </button>
          </>
        )}
      </form>
      {props.advancedSearchOpen &&
        props.advancedSearchRef &&
        ReactDOM.createPortal(
          <form
            className="advanced-search"
            {...scope}
            autoComplete="new-password"
            onSubmit={handleSubmit}
          >
            <div className="header">
              <h1>Advanced search</h1>
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
                onChange={(evt) =>
                  updateAdvancedSearch("name", evt.target.value)
                }
              />
              {Object.entries(searchFields).map(([fieldKey, fieldName]) =>
                !fieldKey.startsWith("program") &&
                !fieldKey.startsWith("service") ? (
                  <React.Fragment key={fieldKey}>
                    <div id={"advanced-search-" + fieldKey}>{fieldName}:</div>
                    <input
                      aria-labelledby={"advanced-search-" + fieldKey}
                      type="text"
                      value={search.parseResult.parse[fieldKey] || ""}
                      onChange={(evt) =>
                        updateAdvancedSearch(fieldKey, evt.target.value)
                      }
                      placeholder={getPlaceholder(fieldKey)}
                    />
                  </React.Fragment>
                ) : null
              )}
              <ProgramOrService
                label="Interest"
                parseSuffix="Interest"
                search={search}
                serviceData={serviceData}
                updateAdvancedSearch={updateAdvancedSearch}
              />
              <ProgramOrService
                label="Interaction"
                parseSuffix="Interaction"
                search={search}
                serviceData={serviceData}
                updateAdvancedSearch={updateAdvancedSearch}
                includeDate
              />
            </div>
            <button
              type="button"
              className="secondary"
              disabled={props.disabled}
              onClick={() => props.setAdvancedSearchOpen(false)}
            >
              Collapse
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
      currentSearch: search.value,
    });
  }

  function getInitialSearch(searchFields): Search {
    const parseResult = parseSearch(searchFields, "", props.initialSearchValue);
    return {
      value: serializeSearch(searchFields, parseResult.parse),
      parseResult,
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
      parseResult = parseSearch(searchFields, action.value);
      return { value: action.value, parseResult };
    case SearchTypes.newAdvancedValue:
      const newVals = {
        [action.fieldKey]: action.value,
      };
      if (action.fieldKey === "programInterest") {
        newVals.serviceInterest = "";
      } else if (action.fieldKey === "serviceInterest") {
        newVals.programInterest = "";
      }
      if (action.fieldKey === "programInteraction") {
        newVals.serviceInteraction = "";
      } else if (action.fieldKey === "serviceInteraction") {
        newVals.programInteraction = "";
      }
      parseResult = parseSearch(searchFields, action.currentSearch, newVals);
      const newSearchValue = serializeSearch(searchFields, parseResult.parse);
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

& .advanced-search h1 {
  font-size: 2.4rem;
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
  newAdvancedValue = "newAdvancedValue",
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
  initialSearchValue: SearchParseValues;
  autoFocus?: boolean;
  performSearch(parseResult: SearchParseValues): any;
  disabled: boolean;
  advancedSearchRef: React.MutableRefObject<HTMLElement>;
  advancedSearchOpen: boolean;
  setAdvancedSearchOpen: Dispatch<SetStateAction<boolean>>;
};
