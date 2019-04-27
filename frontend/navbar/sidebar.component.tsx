import React, { useEffect, useContext } from "react";
import { Link } from "@reach/router";
import { useCss, always, maybe } from "kremling";
import { mediaMobile } from "../styleguide.component";
import { UserContext } from "../util/user.context";

export default function Sidebar(props: SidebarProps) {
  const scope = useCss(css);
  const user = useContext(UserContext);

  useEffect(() => {
    if (props.forceShow) {
      window.addEventListener("click", props.hideSidebar);
      return () => window.removeEventListener("click", props.hideSidebar);
    }
  }, [props.forceShow]);

  return (
    <nav
      {...scope}
      className={always("box-shadow-2 sidebar").maybe(
        "force-show",
        props.forceShow
      )}
      onClick={evt => evt.stopPropagation()}
    >
      <ul className="navbar-links">
        <div>
          <li>
            <Link
              to=""
              className="nav-link logo-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div className="logo-row">
                <img
                  className="logo"
                  src="https://static.wixstatic.com/media/738269_e2e22398263d4de8b795dfc67035a1f8~mv2.png/v1/fill/w_254,h_254,al_c,q_80,usm_0.66_1.00_0.01/Comunidades-Unidas-Logo.webp"
                  alt="Comunidades Unidas Logo"
                />
                <div className="product-name">Comunidades</div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="add-client"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Add a client</div>
            </Link>
          </li>
          <li>
            <Link
              to="record-client-visit"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Record client visit</div>
            </Link>
          </li>
          <li>
            <Link
              to="list-clients"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>View clients</div>
            </Link>
          </li>
          <li>
            <Link
              to="report-issue"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Report an issue</div>
            </Link>
          </li>
        </div>
        <div>
          <li>
            <a href="/logout" className="nav-link">
              <div className="switch-account">
                <div>Switch account</div>
                <div>({user.fullName})</div>
              </div>
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );

  function maybeActiveLink({ isCurrent }) {
    return isCurrent ? { style: { backgroundColor: "#f3f3f3" } } : null;
  }

  function maybeHideSidebar() {
    if (props.forceShow) {
      props.hideSidebar();
    }
  }
}

const css = `
${mediaMobile} {
  & .sidebar:not(.force-show) {
    left: calc(-100%);
  }
}

& nav {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 236rem;
  background-color: white;
  transition: left 0.2s ease-in-out;
}

& .navbar-links {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

& .logo-row {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 21rem;
}

& .logo {
  height: 40rem;
}

& .product-name {
  padding-left: 8rem;
}

& .logo-link.nav-link, .logo-link:focus.nav-link:focus {
  height: 40rem;
}

& .nav-link:hover {
  background-color: #dfdfdf;
}

& ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

& li {
  list-style: none;
}

& .nav-link, & .nav-link:focus, & .nav-link:visited {
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  min-height: 56rem;
  padding: 8rem 16rem;
}

& .nav-link > div {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
}

& .switch-account {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;

type SidebarProps = {
  forceShow: boolean;
  hideSidebar: () => any;
};
