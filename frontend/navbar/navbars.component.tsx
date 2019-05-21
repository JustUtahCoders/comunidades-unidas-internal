import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar.component";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../styleguide.component";
import Topnav from "./topnav.component";

type NavbarsProps = {
  path: string;
  children?: JSX.Element | JSX.Element[];
};

export default function Navbars(props: NavbarsProps) {
  const scope = useCss(css);
  const [forceSidebar, setForceSidebar] = useState(false);

  useEffect(() => {
    window.addEventListener("popstate", hideSidebar);
    return () => window.removeEventListener("popstate", hideSidebar);

    function hideSidebar() {
      setForceSidebar(false);
    }
  }, []);

  return (
    <>
      <Topnav showSidebar={() => setForceSidebar(true)} />
      <Sidebar
        forceShow={forceSidebar}
        hideSidebar={() => setForceSidebar(false)}
      />
      <div className="navbar-margin" {...scope}>
        <div className="main-content">{props.children}</div>
      </div>
    </>
  );
}

const css = `
& .main-content {
  margin: 0 auto;
  max-width: 80vw;
}

${mediaDesktop} {
  & .main-content {
    width: 75%;
  }

  & .navbar-margin {
    margin-left: 25vw;
  }
}

//FIXME 
${mediaMobile} {
  & .navbar-margin {
    margin-top: 56rem;
  }
}
`;
