import React from "react";
import boldIconUrl from "../../../icons/111696-text-editor/svg/bold-text.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState,
} from "bandicoot";
import { always } from "kremling";

export default function Bold(props: BoldProps) {
  const { performCommand } = useDocumentExecCommand("bold");
  const { isActive } = useDocumentQueryCommandState("bold");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Bold"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={boldIconUrl} />
    </button>
  );
}

type BoldProps = {};
