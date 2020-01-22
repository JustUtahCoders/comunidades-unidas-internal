import React from "react";
import { useCss } from "kremling";
import { mediaDesktop } from "../styleguide.component";
import { Link } from "@reach/router";

export default function Topnav(props: TopnavProps) {
  const scope = useCss(css);

  return (
    <div className="topnav" {...scope}>
      <div
        role="button"
        className="hamburger"
        onClick={() => props.showSidebar(true)}
      >
        <div />
        <div />
        <div />
      </div>
      <Link to="" className="logo-link">
        Comunidades Unidas
      </Link>
    </div>
  );
}

const css = `
@media print {
  & .topnav {
    display: none !important;
  }
}

& .topnav {
  position: fixed;
  top: 0;
  left: 0;
  height: 5.6rem;
  width: 100vw;
  background-color: white;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 .4rem;
  border-bottom: .1rem solid #e9e9e9;
}
& .logo {
  height: 3rem;
}
& .logo-link, & .logo-link:focus, & .logo-link:visited {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  min-height: 5.6rem;
  padding: 0 .6rem;
}
& .hamburger {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
& .hamburger > * {
  width: 2.4rem;
  border-radius: 3rem;
  height: .3rem;
  background-color: #afafaf;
  margin: 0 1.6rem .4rem 1.6rem;
  display: block;
}
${mediaDesktop} {
  & .topnav {
    display: none;
  }
}
`;

type TopnavProps = {
  showSidebar: (newValue: boolean) => void;
};
