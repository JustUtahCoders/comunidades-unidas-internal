import React, { DOMElement, FormEvent } from "react";
import ReactDOM from "react-dom";
import { useCss, always } from "kremling";
import Styleguide, { mediaDesktop, mediaMobile } from "../styleguide.component";
import { noop } from "lodash-es";

export default function Modal(props: ModalProps) {
  const scope = useCss(css);
  const [containerEl, setContainerEl] = React.useState<HTMLDivElement>(null);

  const shouldShowFooter =
    props.tertiaryText || props.secondaryText || props.primaryText;

  React.useEffect(() => {
    const el = document.createElement("div");
    el.id = "modal";
    document.body.appendChild(el);
    setContainerEl(el);
  }, []);

  React.useEffect(() => {
    document.body.classList.add("scroll-lock");
    document.querySelector("html").classList.add("scroll-lock");

    return () => {
      document.body.classList.remove("scroll-lock");
      document.querySelector("html").classList.remove("scroll-lock");
    };
  });

  if (!containerEl) {
    return null;
  }

  const content = (
    <Styleguide>
      <div className="modal-screen" {...scope} />
      <div
        className={always("modal-dialog").maybe("wide", props.wide)}
        {...scope}
      >
        <div className="modal-header">
          <div>{props.headerText}</div>
          <div className="modal-header-right">
            {props.customHeaderContent}
            <button
              className="icon close"
              style={{ marginLeft: ".8rem" }}
              type="button"
              onClick={props.close}
            >
              &times;
            </button>
          </div>
        </div>
        <div className="modal-body">{props.children}</div>
        {shouldShowFooter && (
          <div className="modal-footer">
            <div>
              {props.tertiaryText && (
                <button
                  className="secondary"
                  type="button"
                  onClick={props.tertiaryAction}
                >
                  {props.tertiaryText}
                </button>
              )}
            </div>
            <div>
              {props.secondaryText && (
                <button
                  className="secondary"
                  type="button"
                  onClick={props.secondaryAction}
                >
                  {props.secondaryText}
                </button>
              )}
              {props.primaryText && (
                <button
                  className="primary"
                  type={props.primarySubmit ? "submit" : "button"}
                  disabled={props.primaryDisabled}
                  onClick={props.primarySubmit ? noop : props.primaryAction}
                >
                  {props.primaryText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Styleguide>
  );

  const el = props.primarySubmit ? (
    <form onSubmit={props.primaryAction}>{content}</form>
  ) : (
    <div>{content}</div>
  );

  return ReactDOM.createPortal(el, containerEl);
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

& .modal-header-right {
  display: flex;
  justify-content: center;
  align-items: center;
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

  & .modal-dialog.wide {
    width: 80vw;
    left: calc(50% - 40vw);
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
  primaryText?: string;
  primaryAction?(arg?: any): any;
  primarySubmit?: boolean;
  primaryDisabled?: boolean;
  secondaryText?: string;
  secondaryAction?(): any;
  tertiaryText?: string;
  tertiaryAction?(): any;
  children: JSX.Element | JSX.Element[];
  wide?: boolean;
  customHeaderContent?: JSX.Element | JSX.Element[];
};
