import React from "react";

export function useForceUpdate() {
  const [, setValue] = React.useState({});
  return () => setValue({});
}
