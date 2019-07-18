import React from "react";
import bulletsIcon from "../../../icons/111696-text-editor/svg/bullets.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState
} from "bandicoot";
import { always } from "kremling";

export default function BulletedList(props: BulletedListProps) {
  const { performCommand } = useDocumentExecCommand("insertUnorderedList");
  const { isActive } = useDocumentQueryCommandState("insertUnorderedList");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Bulleted List"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={bulletsIcon} />
    </button>
  );
}

type BulletedListProps = {};
