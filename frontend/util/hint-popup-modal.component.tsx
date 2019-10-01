import React from "react";
import { useCss } from "kremling";
import infoIcon from "../../icons/148705-essential-collection/svg/info.svg";

export default function HintPopupModal(props: HintPopupModalProps) {
  const scope = useCss(css);
  const [hintPopupOpen, setHintPopupOpen] = React.useState(false);
  return (
    <>
      <div className="hint-button-container" {...scope}>
        <img
          src={infoIcon}
          alt="info icon"
          className="info-icon"
          onClick={() => setHintPopupOpen(!hintPopupOpen)}
        />
        {hintPopupOpen === true && (
          <div
            className="popup hint-dialog-box"
            style={{ top: props.top, left: props.left }}
          >
            {props.hintMessage}
          </div>
        )}
      </div>
      {hintPopupOpen === true && (
        <div
          className="hint-modal-screen"
          onClick={() => setHintPopupOpen(false)}
          {...scope}
        />
      )}
    </>
  );
}

const css = `
& .hint-button-container {
	position: absolute;
	right: 3.25rem;
}

& .info-icon {
	width: 1.5rem;
}

& .hint-dialog-box {
	position: absolute;
	max-width: 30rem;
	padding: 1rem;
	border-radius: 0 15pt 15pt 15pt;
	font-size: 1.25rem;
}

& .hint-modal-screen {
	background-color: transparent;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 24rem;
	z-index: 10000;
}
`;

type HintPopupModalProps = {
  hintMessage: string;
  top: string;
  left: string;
};
