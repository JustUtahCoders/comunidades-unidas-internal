import React from "react";
import easyFetch from "../../util/easy-fetch";
import { ClientListClient } from "../../client-list/client-list.component";
import { useCss, m } from "kremling";
import userIconUrl from "../../../icons/148705-essential-collection/svg/user.svg";
import dayjs from "dayjs";
import { SingleClient } from "../../view-edit-client/view-client.component";

const SingleClientSearchInput = React.forwardRef<
  SingleClientSearchInputRef,
  SingleClientSearchInputProps
>(function SingleClientSearchInput(
  {
    autoFocus,
    nextThingToFocusRef,
    required = true,
    clientChanged,
    hideLabel,
    initialClient,
  },
  singleClientSearchInputRef
) {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState);
  const scope = useCss(css);
  const debouncedClientName = useDebounce(state.clientName, 200);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // @ts-ignore
  React.useImperativeHandle(singleClientSearchInputRef, () => state);

  React.useEffect(() => {
    if (clientChanged) {
      clientChanged();
    }
  }, [state.clientId]);

  React.useEffect(() => {
    if (
      debouncedClientName.trim().length > 0 &&
      (!initialClient || debouncedClientName !== initialClient.fullName)
    ) {
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
    if (state.clientId && nextThingToFocusRef && nextThingToFocusRef.current) {
      nextThingToFocusRef.current.focus();
    }
  }, [
    state.clientId,
    nextThingToFocusRef,
    nextThingToFocusRef && nextThingToFocusRef.current,
  ]);

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
      {!hideLabel && (
        <div>
          <label id="single-client-search-label">Client name</label>
        </div>
      )}
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
                    // @ts-ignore
                    client: potentialClient,
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
        // @ts-ignore
        client: state.potentialClients[selectedIndex],
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

  function getInitialState(): SingleClientSearchInputState {
    return {
      clientName: initialClient ? initialClient.fullName : "",
      potentialClients: [],
      client: initialClient ? initialClient : null,
      clientId: initialClient ? initialClient.id : null,
    };
  }
});

export default SingleClientSearchInput;

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
        client: action.client,
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
  client?: SingleClient;
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
  client: SingleClient;
  clientName: string;
  clientId: number;
};

type SingleClientSearchInputProps = {
  autoFocus?: boolean;
  nextThingToFocusRef?: React.RefObject<HTMLElement>;
  required?: boolean;
  clientChanged?: () => any;
  hideLabel?: boolean;
  initialClient?: SingleClient;
};

type SingleClientSearchInputRef = {
  clientId: number;
  client: SingleClient;
};
