import React from "react";
import css from "./chip.css";
import { useCss } from "kremling";

export default function Chip(props: ChipProps) {
  const [isPreviewing, setIsPreviewing] = React.useState<boolean>(false);

  React.useEffect(() => {
    window.addEventListener("cu-chip:close-preview", () => {
      setIsPreviewing(false);
    });
  });

  return (
    <>
      <div
        {...useCss(css)}
        className="chip"
        role="button"
        tabIndex={0}
        onClick={() => setIsPreviewing(true)}
      >
        <div className="top-content">{props.topContent}</div>
        <div className="bottom-content" style={props.bottomStyles}>
          {props.bottomContent}
        </div>
      </div>
      {isPreviewing &&
        props.renderPreview({
          close: () => {
            setIsPreviewing(false);
          },
        })}
    </>
  );
}

type ChipProps = {
  topContent: React.ReactElement | React.ReactElement[];
  bottomContent: React.ReactElement | React.ReactElement[];
  renderPreview(RenderPreviewProps): React.ReactElement | React.ReactElement[];
  bottomStyles?: object;
  startPreviewing?: boolean;
};

type RenderPreviewProps = {
  close(): any;
};
