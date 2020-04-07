import React from "react";
import easyFetch from "../../util/easy-fetch";
import { ClientListClient } from "../../client-list/client-list.component";
import { useCss, m } from "kremling";
import userIconUrl from "../../../icons/148705-essential-collection/svg/user.svg";
import dayjs from "dayjs";

export default React.forwardRef<
  React.MutableRefObject<SingleClientSearchInputRef>,
  SingleClientSearchInputProps
>(function SingleClientSearchInput(
  { autoFocus, nextThingToFocusRef, required = true, clientChanged },
  singleClientSearchInputRef
) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const scope = useCss(css);
  const debouncedClientName = useDebounce(state.clientName, 200);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (singleClientSearchInputRef) {
      // @ts-ignore
      singleClientSearchInputRef.current = {
        clientId: state.clientId,
      };
    }
  });

  React.useEffect(() => {
    if (clientChanged) {
      clientChanged();
    }
  }, [state.clientId, clientChanged]);

  React.useEffect(() => {
    if (debouncedClientName.trim().length > 0) {
      const abortController = new AbortController();

      const queryParamName = isNaN(Number(state.clientName)) ? "name" : "id";

      easyFetch(`/api/clients?${queryParamName}=${state.clientName}`, {
        signal: abortController.signal,
      })
        .then((results) => {
          dispatch({
            type: "newPotentialClients",
            clients: results.clients,
          });
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        });

      return () => abortController.abort();
    }
  }, [debouncedClientName.trim()]);

  React.useEffect(() => {
    if (state.clientName.trim().length === 0) {
      dispatch({ type: "reset" });
    }
  }, [state.clientName]);

  React.useEffect(() => {
    if (state.clientId && nextThingToFocusRef.current) {
      nextThingToFocusRef.current.focus();
    }
  }, [state.clientId, nextThingToFocusRef.current]);

  React.useEffect(() => {
    if (
      state.potentialClients.length <= 0 &&
      !state.clientId &&
      state.clientName.trim().length !== 0
    ) {
      inputRef.current.setCustomValidity("Please choose a client");
    } else {
      inputRef.current.setCustomValidity("");
    }
  }, [state.clientId, state.potentialClients, state.clientName]);

  return (
    <div {...scope} className="single-client-search">
      <div>
        <label id="single-client-search-label">Client name</label>
      </div>
      <span className="single-client-search-input-container">
        <input
          type="text"
          autoFocus={autoFocus}
          value={state.clientName}
          onChange={(evt) =>
            dispatch({ type: "newClientName", clientName: evt.target.value })
          }
          aria-labelledby="single-client-search"
          onKeyDown={handleKeyDown}
          required={required}
          ref={inputRef}
        />
        {state.clientId && <img src={userIconUrl} className="client-icon" />}
      </span>
      {state.potentialClients.length > 0 && !state.clientId && (
        <div className="popup">
          <ul>
            {state.potentialClients.map((potentialClient, i) => (
              <li
                key={potentialClient.id}
                className={m("selected-index", selectedIndex === i)}
                onClick={() =>
                  dispatch({
                    type: "setClient",
                    clientId: potentialClient.id,
                    clientName: potentialClient.fullName,
                  })
                }
              >
                <button
                  type="button"
                  className="unstyled city-button"
                  tabIndex={-1}
                  title={potentialClient.fullName}
                >
                  {`${potentialClient.fullName} (${dayjs(
                    potentialClient.birthday
                  ).format("M/D/YYYY")}) (#${potentialClient.id})`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  function handleKeyDown(evt) {
    if (evt.key === "Enter" && state.potentialClients.length > 0) {
      evt.preventDefault();
      dispatch({
        type: "setClient",
        clientId: state.potentialClients[selectedIndex].id,
        clientName: state.potentialClients[selectedIndex].fullName,
      });
    } else if (evt.key === "ArrowDown") {
      setSelectedIndex(
        state.potentialClients.length - 1 === selectedIndex
          ? 0
          : selectedIndex + 1
      );
    } else if (evt.key === "ArrowUp") {
      setSelectedIndex(
        selectedIndex === 0
          ? state.potentialClients.length - 1
          : selectedIndex - 1
      );
    } else {
      setSelectedIndex(0);
    }
  }
});

const css = `
& .single-client-search {
  position: relative;
}

& .selected-index {
  background-color: darkgray;
}

& .single-client-search-input-container {
  position: relative;
}

& .single-client-search-input-container input {
  padding-right: 2rem;
}

& .client-icon {
  position: absolute;
  top: .3rem;
  right: .4rem;
  height: 75%;
}
`;

const initialState: SingleClientSearchInputState = {
  clientName: "",
  potentialClients: [],
  clientId: null,
};

function reducer(
  state: SingleClientSearchInputState,
  action: SingleClientSearchInputAction
): SingleClientSearchInputState {
  switch (action.type) {
    case "newClientName":
      return { ...state, clientName: action.clientName, clientId: null };
    case "newPotentialClients":
      return { ...state, potentialClients: action.clients };
    case "reset":
      return { ...state, potentialClients: [], clientId: null };
    case "setClient":
      return {
        ...state,
        clientId: action.clientId,
        clientName: action.clientName,
      };
    default:
      throw Error();
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

type SingleClientSearchInputState = {
  clientName: string;
  potentialClients: ClientListClient[];
  clientId?: number;
};

type SingleClientSearchInputAction =
  | NewClientNameAction
  | NewPotentialClientsAction
  | ResetAction
  | SetClientAction;

type NewClientNameAction = {
  type: "newClientName";
  clientName: string;
};

type NewPotentialClientsAction = {
  type: "newPotentialClients";
  clients: ClientListClient[];
};

type ResetAction = {
  type: "reset";
};

type SetClientAction = {
  type: "setClient";
  clientName: string;
  clientId: number;
};

type SingleClientSearchInputProps = {
  autoFocus?: boolean;
  nextThingToFocusRef?: React.RefObject<HTMLElement>;
  required?: boolean;
  clientChanged?: () => any;
};

type SingleClientSearchInputRef = {
  clientId: number;
};
