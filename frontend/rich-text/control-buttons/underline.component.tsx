import React from "react";
import underlineIconUrl from "../../../icons/111696-text-editor/svg/undelined.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState,
} from "bandicoot";
import { always } from "kremling";

export default function Underline(props: UnderlineProps) {
  const { performCommand } = useDocumentExecCommand("underline");
  const { isActive } = useDocumentQueryCommandState("underline");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Underline"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={underlineIconUrl} />
    </button>
  );
}

type UnderlineProps = {};
