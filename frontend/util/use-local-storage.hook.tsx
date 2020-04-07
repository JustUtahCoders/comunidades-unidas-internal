import React from "react";

export function useLocalStorageState(key, transform) {
  const [val, setVal] = React.useState(() =>
    transform(localStorage.getItem(key))
  );

  React.useEffect(() => {
    localStorage.setItem(key, val);
  }, [val]);

  return [val, setVal];
}

export function localStorageBoolean(str: string) {
  return str === "true";
}
