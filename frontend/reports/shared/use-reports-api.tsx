import React from "react";
import easyFetch from "../../util/easy-fetch";

export function useReportsApi(url: string, extraQuery: string = "") {
  const [afterFirstMount, setAfterFirstMount] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const extraQueryPrefix = window.location.search.length > 1 ? "&" : "?";
  const fullUrl = url + window.location.search + extraQueryPrefix + extraQuery;

  React.useEffect(() => {
    setAfterFirstMount(true);
  });

  React.useEffect(() => {
    if (afterFirstMount) {
      dispatch({ type: "reset" });

      const abortController = new AbortController();

      easyFetch(fullUrl, { signal: abortController.signal }).then(
        (data) => {
          dispatch({ type: "newData", data });
        },
        (err) => {
          dispatch({ type: "error", err });
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => {
        abortController.abort();
      };
    }
  }, [fullUrl, afterFirstMount]);

  return state;
}

const initialState = { isLoading: true, error: null, data: null };

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "newData":
      return {
        isLoading: false,
        error: null,
        data: action.data,
      };
    case "error":
      return {
        isLoading: false,
        error: action.err,
        data: null,
      };
    default:
      throw Error();
  }
}
