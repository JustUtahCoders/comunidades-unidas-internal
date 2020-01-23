import React from "react";
import queryString from "query-string";
import { identity } from "lodash-es";

export function useQueryParamState(
  name: string,
  initialValue: string = "",
  transformer: Transformer = identity
): [string | string[], Setter] {
  const [value, setValue] = React.useState(
    () => queryString.parse(window.location.search)[name] || initialValue
  );

  React.useEffect(() => {
    const query = queryString.parse(window.location.search);
    if (value) {
      // @ts-ignore
      query[name] = value;
    } else {
      // @ts-ignore
      delete query[name];
    }
    window.history.replaceState(
      history.state,
      document.title,
      location.pathname + "?" + queryString.stringify(query)
    );
  }, [value]);

  return [transformer(value), setValue];
}

type Setter = (val: string) => any;

type Transformer = (val: string | string[]) => string;
