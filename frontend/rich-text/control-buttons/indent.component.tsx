import React from "react";
import indentUrl from "../../../icons/111696-text-editor/svg/text-in.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState,
} from "bandicoot";
import { always } from "kremling";

export default function Indent(props: IndentProps) {
  const { performCommand } = useDocumentExecCommand("indent");
  const { isActive } = useDocumentQueryCommandState("indent");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Indent"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={indentUrl} />
    </button>
  );
}

type IndentProps = {};
