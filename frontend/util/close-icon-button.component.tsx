import React from "react";

export default function CloseIconButton(props: CloseIconButtonProps) {
  return (
    <button
      type="button"
      className="unstyled"
      onClick={props.close}
      style={{ cursor: "pointer" }}
    >
      {"\u24E7"}
    </button>
  );
}

type CloseIconButtonProps = {
  close(): any;
};
