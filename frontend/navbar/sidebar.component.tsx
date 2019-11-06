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
      className={always("sidebar").maybe("force-show", props.forceShow)}
      onClick={evt => evt.stopPropagation()}
    >
      <div className="navbar-links">
        <ul>
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
              to="client-list"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Client list</div>
            </Link>
          </li>
          <li>
            <Link
              to="add-client"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Add client</div>
            </Link>
          </li>
          <li>
            <Link
              to="add-client-interaction"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Add client interaction</div>
            </Link>
          </li>
          <li>
            <Link
              to="add-case-note"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Add case note</div>
            </Link>
          </li>
          <li>
            <Link
              to="add-leads"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Add leads</div>
            </Link>
          </li>
          <li>
            <Link
              to="lead-list"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <div>Lead list</div>
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
        </ul>
        <ul>
          <li>
            <a href="/logout" className="nav-link">
              <div className="switch-account">
                <div>Switch account</div>
                <div>({user.fullName})</div>
              </div>
            </a>
          </li>
        </ul>
      </div>
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

& .sidebar {
  box-shadow: .2rem 0 .2rem var(--light-gray);
  z-index: 1000;
}

& nav {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 23.6rem;
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
  font-size: 2.1rem;
}

& .logo {
  height: 4rem;
}

& .product-name {
  padding-left: .8rem;
}

& .logo-link.nav-link, .logo-link:focus.nav-link:focus {
  height: 4rem;
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
  min-height: 5.6rem;
  padding: .8rem 1.6rem;
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
