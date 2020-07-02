import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar.component";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../styleguide.component";
import Topnav from "./topnav.component";

type NavbarsProps = {
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
        <main className="main-content">{props.children}</main>
      </div>
    </>
  );
}

const css = `
& .main-content {
  margin: 0 auto;
  max-width: 80rem;
}

& .main-content.full {
  max-width: inherit;
  width: inherit;
}

${mediaDesktop} {
  & .main-content {
    width: 75%;
  }

  & .navbar-margin {
    margin-left: 23.6rem;
  }

  body.collapsed-sidebar .navbar-margin {
    margin-left: 7.2rem;
  }
}

${mediaMobile} {
  & .navbar-margin {
    margin-top: 5.6rem;
  }
}
`;
