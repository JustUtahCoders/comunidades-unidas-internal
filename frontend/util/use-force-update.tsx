import React from "react";

export function useForceUpdate() {
  const [bool, setBool] = React.useState(false);
  return () => setBool((b) => !b);
}
