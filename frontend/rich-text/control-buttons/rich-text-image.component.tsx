import React from "react";
import imageIconUrl from "../../../icons/111696-text-editor/svg/insert-picture.svg";
import { useImage } from "bandicoot";

export default function RichTextImage(props: RichTextImageProps) {
  const { chooseFile, removeImage } = useImage({ processImgElement });

  return (
    <button
      className="icon"
      title="Insert image"
      onClick={chooseFile}
      tabIndex={5}
      type="button"
    >
      <img src={imageIconUrl} />
    </button>
  );

  function processImgElement(imgElement) {
    imgElement.style.maxWidth = "30rem";
  }
}

type RichTextImageProps = {};
