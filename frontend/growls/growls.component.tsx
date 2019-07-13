import React from "react";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../styleguide.component";
import stopIcon from "../../icons/148705-essential-collection/svg/stop-1.svg";
import infoIcon from "../../icons/148705-essential-collection/svg/info.svg";
import successIcon from "../../icons/148705-essential-collection/svg/success.svg";
import "./error-listener";

export function showGrowl(growl: Growl) {
  window.dispatchEvent(
    new CustomEvent("showgrowl", {
      detail: growl
    })
  );
}

export default function Growls(props: GrowlsProps) {
  const [growls, setGrowls] = React.useState([]);
  const [hovering, setHovering] = React.useState(false);
  const scope = useCss(css);

  React.useEffect(() => {
    window.addEventListener("showgrowl", handleGrowl);
    return () => window.removeEventListener("showgrowl", handleGrowl);

    function handleGrowl(evt: CustomEvent) {
      const newGrowl = evt.detail;
      setGrowls([...growls, newGrowl]);
    }
  }, [growls]);

  React.useEffect(() => {
    if (!hovering) {
      const timeoutId = setTimeout(() => {
        setGrowls([]);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [growls, hovering]);

  if (growls.length === 0) {
    return null;
  }

  return (
    <div className="growls" {...scope}>
      {growls.map((growl, index) => (
        <div
          className="growl"
          key={index}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
        >
          <div className="left">
            <img
              src={getIcon(growl)}
              alt="Error"
              title="Error"
              className="status-icon"
            />
            {growl.message}
            {growl.actionText && growl.action && (
              <button
                className="secondary report-button"
                onClick={() => handleActionClick(growl)}
              >
                {growl.actionText}
              </button>
            )}
          </div>
          <button className="icon close" onClick={() => removeGrowl(growl)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );

  function getIcon(growl: Growl) {
    switch (growl.type) {
      case GrowlType.error:
        return stopIcon;
      case GrowlType.info:
        return infoIcon;
      case GrowlType.success:
        return successIcon;
      default:
        console.error(Error(`Unknown growl type: ${growl.type}`));
    }
  }

  function handleActionClick(growl: Growl) {
    removeGrowl(growl);
    growl.action();
  }

  function removeGrowl(growl: Growl) {
    setGrowls(growls.filter(g => g !== growl));
  }

  function handleHover() {
    setHovering(true);
  }

  function handleMouseLeave() {
    setHovering(false);
  }
}

const css = `
& .growls {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

& .growl {
  background-color: var(--very-dark-gray);
  color: white;
  height: 6rem;
  border-radius: .5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .4rem 1rem;
}

& .close {
  color: var(--medium-gray);
  width: 3rem;
  height: 3rem;
  font-size: 2.4rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

& .close:hover {
  color: var(--very-dark-gray);
}

& .left {
  display: flex;
  align-items: center;
}

& .status-icon {
  height: 3.75rem;
  margin-right: 1.6rem;
}

& .report-button {
  margin-left: 1.6rem;
}

${mediaDesktop} {
  & .growl {
    width: 45rem;
    margin-bottom: .2rem;
  }
}

${mediaMobile} {
  & .growl {
    width: 100%;
  }
}
`;

type GrowlsProps = {};

export enum GrowlType {
  error = "error",
  info = "info",
  success = "success"
}

type Growl = {
  type: GrowlType;
  message: string;
  action?(): void;
  actionText?: string;
};
