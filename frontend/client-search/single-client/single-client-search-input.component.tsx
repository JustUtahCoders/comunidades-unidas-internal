import React from "react";

export default function SingleClientSearchInput(
  props: SingleClientSearchInputProps
) {
  return <input type="text" autoFocus={props.autoFocus} />;
}

type SingleClientSearchInputProps = {
  autoFocus?: boolean;
};
