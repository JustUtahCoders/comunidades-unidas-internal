import React, { useEffect, useContext } from "react";
import { Link } from "@reach/router";
import { useCss, always, maybe } from "kremling";
import { mediaMobile } from "../styleguide.component";
import { UserContext } from "../util/user.context";
import {
  useLocalStorageState,
  localStorageBoolean,
} from "../util/use-local-storage.hook";
import addClientIconUrl from "../../icons/148705-essential-collection/svg/add-1.svg";
import reportIssueUrl from "../../icons/148705-essential-collection/svg/info.svg";
import recordVisitUrl from "../../icons/148705-essential-collection/svg/hourglass-2.svg";
import clientListUrl from "../../icons/148705-essential-collection/svg/folder-14.svg";
import caseNoteUrl from "../../icons/148705-essential-collection/svg/note.svg";
import leadListUrl from "../../icons/148705-essential-collection/svg/list-1.svg";
import reportsUrl from "../../icons/148705-essential-collection/svg/volume-control-1.svg";
import addLeadsUrl from "../../icons/148705-essential-collection/svg/windows-3.svg";
import eventListUrl from "../../icons/148705-essential-collection/svg/calendar-1.svg";
import adminSettingsUrl from "../../icons/148705-essential-collection/svg/settings-1.svg";
import expandUrl from "../../icons/148705-essential-collection/svg/fast-forward.svg";
import collapseUrl from "../../icons/148705-essential-collection/svg/rewind.svg";
import loginUrl from "../../icons/148705-essential-collection/svg/login.svg";
import invoicesUrl from "../../icons/148705-essential-collection/svg/price-tag.svg";

export default function Sidebar(props: SidebarProps) {
  const scope = useCss(css);
  const user = useContext(UserContext);
  const [collapsed, setCollapsed] = useLocalStorageState(
    "collapse-sidebar",
    localStorageBoolean
  );

  useEffect(() => {
    document.body.classList.toggle("collapsed-sidebar", collapsed);
  });

  useEffect(() => {
    if (props.forceShow) {
      window.addEventListener("click", props.hideSidebar);
      return () => window.removeEventListener("click", props.hideSidebar);
    }
  }, [props.forceShow]);

  return (
    <nav
      {...scope}
      className={always("sidebar")
        .maybe("force-show", props.forceShow)
        .maybe("collapsed", collapsed)}
      onClick={(evt) => evt.stopPropagation()}
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
                <div className="product-name expanded">Comunidades</div>
              </div>
            </Link>
          </li>
          <li title="Client list">
            <Link
              to="client-list"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={clientListUrl}
                alt="Client list"
              />
              <div className="expanded">Client list</div>
            </Link>
          </li>
          <li title="Add client">
            <Link
              to="add-client"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={addClientIconUrl}
                alt="Add client"
              />
              <div className="expanded">Add client</div>
            </Link>
          </li>
          <li title="Add client interaction">
            <Link
              to="add-client-interaction"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={recordVisitUrl}
                alt="Add client interaction"
              />
              <div className="expanded">Add client interaction</div>
            </Link>
          </li>
          <li title="Add case note">
            <Link
              to="add-case-note"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={caseNoteUrl}
                alt="Add case note"
              />
              <div className="expanded">Add case note</div>
            </Link>
          </li>
          <li title="Lead list">
            <Link
              to="lead-list"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img className="collapsed" src={leadListUrl} alt="Lead list" />
              <div className="expanded">Lead list</div>
            </Link>
          </li>
          <li title="Add leads">
            <Link
              to="add-leads"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img className="collapsed" src={addLeadsUrl} alt="Add leads" />
              <div className="expanded">Add leads</div>
            </Link>
          </li>
          <li title="Events List">
            <Link
              to="event-list"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img className="collapsed" src={eventListUrl} alt="Events List" />
              <div className="expanded">Events List</div>
            </Link>
          </li>
          <li title="Invoices">
            <Link
              to="invoices"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img className="collapsed" src={invoicesUrl} alt="Invoices" />
              <div className="expanded">Invoices</div>
            </Link>
          </li>
          <li title="Programs and Services">
            <Link
              to="admin-settings"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={adminSettingsUrl}
                alt="Admin Settings"
              />
              <div className="expanded">Admin Settings</div>
            </Link>
          </li>
          <li title="Reports URL">
            <Link
              to="reports"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img className="collapsed" src={reportsUrl} alt="Reports URL" />
              <div className="expanded">Reports</div>
            </Link>
          </li>
          <li title="File an issue">
            <Link
              to="report-issue"
              className="nav-link"
              onClick={maybeHideSidebar}
              getProps={maybeActiveLink}
            >
              <img
                className="collapsed"
                src={reportIssueUrl}
                alt="File an issue"
              />
              <div className="expanded">File an issue</div>
            </Link>
          </li>
        </ul>
        <ul>
          <li title={collapsed ? "Expand" : "Collapse"}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setCollapsed(!collapsed)}
              className="nav-link"
            >
              <img className="collapsed" src={expandUrl} alt="Expand" />
              <div className="expanded">
                <div>Collapse</div>
                <img
                  src={collapseUrl}
                  alt="Collapse"
                  style={{ width: "2rem" }}
                />
              </div>
            </div>
            <a href="/logout" className="nav-link">
              <img
                className="collapsed"
                src={loginUrl}
                alt="Switch account / Logout"
              />
              <div className="switch-account expanded">
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
@media print {
  & .sidebar {
    display: none;
  }
}

${mediaMobile} {
  & .sidebar:not(.force-show) {
    left: calc(-100%);
  }
}

& .sidebar {
  box-shadow: .2rem 0 .2rem var(--light-gray);
  z-index: 1000;
  overflow-y: auto;
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

& nav.sidebar.collapsed {
  width: 7.2rem;
}

& .sidebar .collapsed {
  display: none;
  width: 2.5rem;
  margin: 0 auto;
}

& .sidebar .expanded {
  display: flex;
  justify-content: space-between;
}

& .sidebar.collapsed .collapsed {
  display: block;
}

& .sidebar.collapsed .expanded {
  display: none;
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
