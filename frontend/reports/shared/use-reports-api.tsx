import React from "react";
import easyFetch from "../../util/easy-fetch";

export function useReportsApi(url: string, extraQuery: string = "") {
  const [afterFirstMount, setAfterFirstMount] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, getInitialState());

  React.useEffect(() => {
    setAfterFirstMount(true);
  });

  React.useEffect(() => {
    const fullUrl = getFullUrl();
    if (fullUrl !== state.fullUrl) {
      dispatch({
        type: "new-url",
        fullUrl,
      });
    }
  });

  React.useEffect(() => {
    if (afterFirstMount) {
      dispatch({ type: "reset" });

      const abortController = new AbortController();

      easyFetch(state.fullUrl, { signal: abortController.signal }).then(
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
  }, [state.fullUrl, afterFirstMount]);

  return state;

  function getFullUrl() {
    const extraQueryPrefix = window.location.search.length > 1 ? "&" : "?";
    const fullUrl =
      url + window.location.search + extraQueryPrefix + extraQuery;
    return fullUrl;
  }

  function getInitialState() {
    return {
      isLoading: true,
      error: null,
      data: null,
      fullUrl: getFullUrl(),
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case "reset":
        return getInitialState();
      case "newData":
        return {
          ...state,
          isLoading: false,
          error: null,
          data: action.data,
        };
      case "error":
        return {
          ...state,
          isLoading: false,
          error: action.err,
          data: null,
        };
      case "new-url":
        return {
          ...state,
          fullUrl: action.fullUrl,
        };
      default:
        throw Error();
    }
  }
}
