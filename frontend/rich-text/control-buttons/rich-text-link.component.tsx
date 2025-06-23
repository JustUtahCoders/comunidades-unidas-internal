import ReactDOM from "react-dom";
import React from "react";
import linkIconUrl from "../../../icons/111696-text-editor/svg/link.svg";
import { useLink } from "bandicoot";
import { useCss } from "kremling";

export default function RichTextLink(props: RichTextLinkProps) {
  const [showingPopup, setShowingPopup] = React.useState(false);
  const [linkLabel, setLinkLabel] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [anchorForPopup, setAnchorForPopup] = React.useState(null);
  const displayedTextRef = React.useRef(null);
  const { insertLink, selectEntireLink, getTextFromBeforeBlur, unlink } =
    useLink({ processAnchorElement });
  const scope = useCss(css);

  React.useEffect(() => {
    if (showingPopup) {
      displayedTextRef.current.focus();
      setLinkLabel(getTextFromBeforeBlur() || "");
      window.addEventListener("click", closePopup);
      window.addEventListener("keyup", handleKeyDown);

      return () => {
        window.removeEventListener("click", closePopup);
        window.removeEventListener("keyup", handleKeyDown);
      };
    }

    function handleKeyDown(evt) {
      if (evt.key === "Escape") {
        closePopup();
      }
    }
  }, [showingPopup]);

  React.useEffect(() => {
    if (anchorForPopup) {
      window.addEventListener("click", closeAnchorPopup);
      window.addEventListener("keyup", handleKeyDown);

      return () => {
        window.removeEventListener("click", closeAnchorPopup);
        window.removeEventListener("keyup", handleKeyDown);
      };
    }

    function handleKeyDown(evt) {
      if (evt.key === "Escape") {
        closeAnchorPopup();
      }
    }
  });

  return (
    <div className="link-container" {...scope}>
      <button
        className="icon"
        title="Link"
        onClick={() => setShowingPopup(!showingPopup)}
        type="button"
        tabIndex={5}
      >
        <img src={linkIconUrl} />
      </button>
      {showingPopup && (
        <form
          className="popup"
          onClick={(evt) => evt.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h3>Insert a link</h3>
          <hr />
          <div>
            <label id="link-popup-label">Displayed text</label>
            <input
              type="text"
              value={linkLabel}
              onChange={(evt) => setLinkLabel(evt.target.value)}
              aria-labelledby="link-popup-label"
              ref={displayedTextRef}
            />
          </div>
          <div>
            <label id="link-popup-url">Link</label>
            <input
              type="text"
              value={linkUrl}
              onChange={(evt) => setLinkUrl(evt.target.value)}
              aria-labelledby="link-popup-url"
            />
          </div>
          <div>
            <button className="secondary" type="button" onClick={reset}>
              Cancel
            </button>
            <button className="primary" type="submit">
              Add link
            </button>
          </div>
        </form>
      )}
      {anchorForPopup &&
        ReactDOM.createPortal(
          <form
            className="popup"
            {...scope}
            style={popupBelowLinkStyles()}
            onClick={(evt) => evt.stopPropagation()}
            onSubmit={anchorPopupSubmit}
          >
            <div>
              <span>Go to link: </span>
              <a href={anchorForPopup.href} target="_blank">
                {anchorForPopup.href}
              </a>
            </div>
            <div>
              <button className="secondary" type="button" onClick={removeLink}>
                Remove link
              </button>
              <button className="primary" type="submit">
                Done
              </button>
            </div>
          </form>,
          anchorForPopup.offsetParent
        )}
    </div>
  );

  function anchorPopupSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    closeAnchorPopup();
  }

  function removeLink() {
    selectEntireLink(anchorForPopup);
    unlink();
    setAnchorForPopup(null);
  }

  function popupBelowLinkStyles() {
    return {
      top: anchorForPopup.offsetTop + anchorForPopup.offsetHeight + 4,
      left: anchorForPopup.offsetLeft,
    };
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    insertLink(linkUrl, linkLabel);
    reset();
  }

  function processAnchorElement(anchorElement) {
    anchorElement.addEventListener("click", () => {
      setAnchorForPopup(anchorElement);
    });
  }

  function reset() {
    setLinkLabel("");
    setLinkUrl("");
    setShowingPopup(false);
  }

  function closePopup() {
    setShowingPopup(false);
    props.richTextEditorRef.current.focus();
  }

  function closeAnchorPopup() {
    setAnchorForPopup(null);
    props.richTextEditorRef.current.focus();
  }
}

const css = `
& .link-container {
  position: relative;
}

& h3 {
  margin: 0;
}

& .popup {
  right: 0;
  padding: 1.6rem;
}

& .popup > div:not(:first-child) {
  margin-top: 1.6rem;
}
`;

type RichTextLinkProps = {
  richTextEditorRef: React.RefObject<HTMLElement>;
};
