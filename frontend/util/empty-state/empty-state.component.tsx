import React from "react";
import { useCss } from "kremling";
import css from "./empty-state.css";
import imageUrl from "../../../icons/148705-essential-collection/svg/garbage.svg";

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div {...useCss(css)} className="empty-state">
      <img src={imageUrl} alt="empty garbage can" />
      <div>No {props.pluralName} yet!</div>
    </div>
  );
}

type EmptyStateProps = {
  pluralName: string;
};
