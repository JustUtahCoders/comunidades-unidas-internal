import React from "react";
import numbersIcon from "../../../icons/111696-text-editor/svg/numbering.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState
} from "bandicoot";
import { always } from "kremling";

export default function NumberedList(props: NumberedListProps) {
  const { performCommand } = useDocumentExecCommand("insertOrderedList");
  const { isActive } = useDocumentQueryCommandState("insertOrderedList");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Numbered List"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={numbersIcon} />
    </button>
  );
}

type NumberedListProps = {};
