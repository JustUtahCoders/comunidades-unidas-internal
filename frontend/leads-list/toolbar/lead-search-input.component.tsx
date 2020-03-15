import React from "react";
import ReactDOM from "react-dom";
import { useCss } from "kremling";
import {
  SearchParseValues,
  parseSearch,
  SearchParse,
  deserializeSearch,
  serializeSearch
} from "../../util/list-search/search-dsl.helpers";
import ProgramOrService from "../../client-list/toolbar/program-or-service.component";

const searchFields = {
  id: "Lead ID",
  zip: "ZIP Code",
  phone: "Phone",
  program: "Interest",
  service: "Interest",
  event: "Event Attended",
  leadStatus: "Lead Status"
};

export default function LeadSearchInput(props: LeadSearchInputProps) {
  const scope = useCss(css);
  const [showingAdvancedSearch, setShowingAdvancedSearch] = React.useState(
    false
  );
  const [search, dispatchSearch] = React.useReducer(
    searchReducer,
    getInitialSearch(searchFields)
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current.setCustomValidity(search.parseResult.errors.join(". "));
  }, [search]);

  return (
    <div className="search-container" {...scope}>
      <form
        autoComplete="new-password"
        className="search-form"
        onSubmit={handleSubmit}
      >
        <input
          aria-label="Search for leads"
          autoFocus={props.autoFocus}
          className="search-input"
          onChange={handleChange}
          placeholder="Search for leads"
          ref={inputRef}
          type="search"
          value={search.value}
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
            <button className="primary" disabled={props.disabled} type="submit">
              Search
            </button>
          </>
        )}
      </form>
      {showingAdvancedSearch &&
        props.advancedSearchRef &&
        ReactDOM.createPortal(
          <form
            {...scope}
            autoComplete="new-password"
            className="advanced-search"
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
              <div id="advanced-search-name">Lead name:</div>
              <input
                aria-labelledby="advanced-search-name"
                onChange={evt => updateAdvancedSearch("name", evt.target.value)}
                type="text"
                value={search.parseResult.parse.name || ""}
              />
              {Object.entries(searchFields)
                .filter(
                  ([fieldKey]) =>
                    fieldKey !== "program" &&
                    fieldKey !== "service" &&
                    fieldKey !== "leadStatus"
                )
                .map(([fieldKey, fieldName]) =>
                  fieldKey === "event" ? (
                    <React.Fragment key={fieldKey}>
                      <div id={"advanced-search-" + fieldKey}>{fieldName}:</div>
                      <select
                        onChange={evt => {
                          updateAdvancedSearch(fieldKey, evt.target.value);
                        }}
                        value={search.parseResult.parse[fieldKey]}
                      >
                        <option value="">No {fieldKey} selected</option>
                        {props.events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.eventName}
                          </option>
                        ))}
                      </select>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={fieldKey}>
                      <div id={"advanced-search-" + fieldKey}>{fieldName}:</div>
                      <input
                        aria-labelledby={"advanced-search-" + fieldKey}
                        onChange={evt =>
                          updateAdvancedSearch(fieldKey, evt.target.value)
                        }
                        placeholder={getPlaceholder(fieldKey)}
                        type="text"
                        value={search.parseResult.parse[fieldKey] || ""}
                      />
                    </React.Fragment>
                  )
                )}
              <ProgramOrService
                search={search}
                serviceData={props.programData}
                updateAdvancedSearch={updateAdvancedSearch}
              />
              <div>Status:</div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="lead-status"
                    value=""
                    checked={!search.parseResult.parse.leadStatus}
                    onChange={updateLeadStatus}
                  />
                  <span>All</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="lead-status"
                    value="active"
                    checked={search.parseResult.parse.leadStatus === "active"}
                    onChange={updateLeadStatus}
                  />
                  <span>Active</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="lead-status"
                    value="inactive"
                    checked={search.parseResult.parse.leadStatus === "inactive"}
                    onChange={updateLeadStatus}
                  />
                  <span>Inactive</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="lead-status"
                    value="convertedToClient"
                    checked={
                      search.parseResult.parse.leadStatus ===
                      "convertedToClient"
                    }
                    onChange={updateLeadStatus}
                  />
                  <span>Converted To Client</span>
                </label>
              </div>
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

  function getInitialSearch(searchFields): Search {
    let value: string;
    if (props.initialValueFromQueryParams) {
      value = deserializeSearch(searchFields);
    } else {
      value = props.initialValue || "";
    }

    const result = {
      value,
      parseResult: parseSearch(searchFields, value)
    };

    return result;
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

  function updateLeadStatus(evt) {
    updateAdvancedSearch("leadStatus", evt.target.value);
  }
}

function searchReducer(state: Search, action: SearchAction): Search {
  let parseResult;
  switch (action.type) {
    case SearchTypes.newValue:
      parseResult = parseSearch(searchFields, action.value);
      return { value: action.value, parseResult };
    case SearchTypes.newAdvancedValue:
      const newVal = {
        [action.fieldKey]: action.value
      };
      if (action.fieldKey === "program") {
        newVal.service = null;
      } else if (action.fieldKey === "service") {
        newVal.program = null;
      }
      parseResult = parseSearch(searchFields, action.currentSearch, newVal);
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
	border-bottom: 1px solid var(--light-gray);
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

type LeadSearchInputProps = {
  initialValue?: string;
  initialValueFromQueryParams?: boolean;
  autoFocus?: boolean;
  performSearch(parseResult: SearchParseValues): any;
  disabled: boolean;
  advancedSearchRef: React.MutableRefObject<HTMLElement>;
  programData: any;
  events: Array<any>;
};
