import React from "react";
import { useCss } from "kremling";
import kabobIcon from "../../icons/148705-essential-collection/svg/more-1.svg";

export default function DropDownMenuModal(props: DropDownMenuModalProps) {
  const scope = useCss(css);
  const [dropDownOpen, setDropDownOpen] = React.useState(false);

  const mapMenuButtons = props.buttonData.map((button, i) => {
    return (
      <li onClick={button.buttonAction} key={`dropdown-menu-button-${i}`}>
        {button.buttonText}
      </li>
    );
  });

  return (
    <>
      <div className="dropdown-container" {...scope}>
        <img
          alt="kabob icon - drop down menu"
          className="kabob-icon"
          onClick={() => setDropDownOpen(!dropDownOpen)}
          src={kabobIcon}
        />
        {dropDownOpen === true && (
          <div
            className="popup dropdown-dialog-box"
            onClick={() => setDropDownOpen(!dropDownOpen)}
          >
            <ul>{mapMenuButtons}</ul>
          </div>
        )}
      </div>
      {dropDownOpen === true && (
        <div
          className="dropdown-modal-screen"
          onClick={() => setDropDownOpen(!dropDownOpen)}
          {...scope}
        />
      )}
    </>
  );
}

const css = `
& .kabob-icon {
  height: 2rem;
  margin: 0 1rem 0 -0.5rem;
}

& .dropdown-modal-screen {
  background-color: transparent;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 23.5rem;
  z-index: 999;
}

& .dropdown-dialog-box {
  margin-top: 1rem;
  padding: 1rem;
  z-index: 1000;
}

& .dropdown-dialog-box > ul li:hover {
  background-color: --light-gray;
}
`;

export type ButtonOptionsProps = {
  buttonText: string;
  buttonAction?(): any;
};

type DropDownMenuModalProps = {
  buttonData: Array<ButtonOptionsProps>;
};
