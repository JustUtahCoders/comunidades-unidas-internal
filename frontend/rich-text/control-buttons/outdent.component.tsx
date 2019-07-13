import React from "react";
import outdentUrl from "../../../icons/111696-text-editor/svg/text-out.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState
} from "bandicoot";
import { always } from "kremling";

export default function Outdent(props: OutdentProps) {
  const { performCommand } = useDocumentExecCommand("outdent");
  const { isActive } = useDocumentQueryCommandState("outdent");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Unindent"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={outdentUrl} />
    </button>
  );
}

type OutdentProps = {};
