import React from "react";
import italicIconUrl from "../../../icons/111696-text-editor/svg/italics.svg";
import {
  useDocumentExecCommand,
  useDocumentQueryCommandState,
} from "bandicoot";
import { always } from "kremling";

export default function Italic(props: ItalicProps) {
  const { performCommand } = useDocumentExecCommand("italic");
  const { isActive } = useDocumentQueryCommandState("italic");

  return (
    <button
      className={always("icon").maybe("active", isActive)}
      title="Italic"
      onClick={performCommand}
      tabIndex={5}
      type="button"
    >
      <img src={italicIconUrl} />
    </button>
  );
}

type ItalicProps = {};
