import React, { DOMElement } from "react";
import ReactDOM from "react-dom";
import { useCss } from "kremling";
import Styleguide, { mediaDesktop, mediaMobile } from "../styleguide.component";

export default function Modal(props: ModalProps) {
  const scope = useCss(css);
  const [containerEl, setContainerEl] = React.useState<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = document.createElement("div");
    el.id = "modal";
    document.body.appendChild(el);
    setContainerEl(el);
  }, []);

  if (!containerEl) {
    return null;
  }

  return ReactDOM.createPortal(
    <Styleguide>
      <div className="modal-screen" {...scope} />
      <div className="modal-dialog" {...scope}>
        <div className="modal-header">
          <div>{props.headerText}</div>
          <button className="icon close" onClick={props.close}>
            &times;
          </button>
        </div>
        <div className="modal-body">{props.children}</div>
        <div className="modal-footer">
          <div>
            {props.tertiaryText && (
              <button className="secondary" onClick={props.tertiaryAction}>
                {props.tertiaryText}
              </button>
            )}
          </div>
          <div>
            {props.secondaryText && (
              <button className="secondary" onClick={props.secondaryAction}>
                {props.secondaryText}
              </button>
            )}
            <button className="primary" onClick={props.primaryAction}>
              {props.primaryText}
            </button>
          </div>
        </div>
      </div>
    </Styleguide>,
    containerEl
  );
}

const css = `
& .modal-screen {
  background-color: rgba(61, 70, 77, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
}

& .modal-dialog {
  box-shadow: 0 25px 55px 0 rgba(0, 0, 0, 0.2), 0 16px 28px 0 rgba(0, 0, 0, 0.24);
  background-color: white;
  z-index: 100000;
}

& .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7rem;
  padding: 0 1.6rem;
}

& .modal-body {
  background-color: white;
  padding: 1.6rem;
  border-top: 1px solid var(--very-light-gray);
  border-bottom: 1px solid var(--very-light-gray);
}

& .modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7rem;
  padding: 0 1.6rem;
}

${mediaMobile} {
  & .modal-dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
}

${mediaDesktop} {
  & .modal-dialog {
    position: fixed;
    top: 10vh;
    left: calc(50% - 26rem);
    width: 52rem;
    border-radius: .3rem;
  }

  & .modal-body {
    max-height: calc(80vh - 14rem);
    overflow-y: auto;
  }
}

& .close {
  width: 3rem;
  height: 3rem;
  font-size: 2.4rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

type ModalProps = {
  headerText: string;
  close(): any;
  primaryText: string;
  primaryAction(): any;
  secondaryText?: string;
  secondaryAction?(): any;
  tertiaryText?: string;
  tertiaryAction?(): any;
  children: JSX.Element | JSX.Element[];
};
