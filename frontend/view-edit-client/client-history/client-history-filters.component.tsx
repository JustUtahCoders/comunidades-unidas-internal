import React from "react";
import { useCss } from "kremling";
import {
  LogType,
  ClientHistoryFilterOptions
} from "./client-history.component";
import { startCase } from "lodash-es";

export default function ClientHistoryFilters(props: ClientHistoryFiltersProps) {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const scope = useCss(css);

  React.useEffect(() => {
    if (popupOpen) {
      window.addEventListener("click", closePopup);
      return () => window.removeEventListener("click", closePopup);
    }

    function closePopup() {
      setPopupOpen(false);
    }
  }, [popupOpen]);

  return (
    <div {...scope} className="client-history-filters">
      <button className="primary" onClick={togglePopup}>
        Filter history
      </button>
      {popupOpen && (
        <div
          className="popup filter-popup"
          style={{ right: 0, top: "100%" }}
          onClick={evt => evt.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            {Object.keys(LogType).map(logTypeKey => (
              <div key={logTypeKey} className="filter-option">
                <label>
                  <input
                    type="checkbox"
                    checked={props.filters[logTypeKey]}
                    value={logTypeKey}
                    onChange={changeFilter}
                  />
                  <span>
                    {startCase(
                      LogType[logTypeKey].replace("clientUpdated:", "")
                    )}
                  </span>
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="secondary"
              style={{ marginTop: "1.6rem" }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setPopupOpen(false);
  }

  function togglePopup() {
    setPopupOpen(!popupOpen);
  }

  function changeFilter(evt) {
    const logType = evt.target.value;
    props.setFilters({
      ...props.filters,
      [logType]: evt.target.checked
    });
  }
}

const css = `
& .client-history-filters {
  position: relative;
}

& .filter-popup {
  padding: 1.6rem;
  width: 30rem;
}

& .filter-option {
  display: flex;
  align-items: center;
}

& .filter-option label {
  display: flex;
  align-items: center;
}

& .filter-option span {
  padding-left: .8rem;
}
`;

type ClientHistoryFiltersProps = {
  filters: ClientHistoryFilterOptions;
  setFilters(filters: ClientHistoryFilterOptions): void;
};
