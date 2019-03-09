import React from 'react'
import {Link} from '@reach/router'
import {useCss} from 'kremling'

export default function Sidebar() {
  const scope = useCss(css)

  return (
    <nav {...scope} className="box-shadow-1">
      <ul>
        <li>
          <Link to="" className="nav-link logo-link" getProps={maybeActiveLink}>
            <div className="logo-row">
              <img
                className="logo"
                src="https://static.wixstatic.com/media/738269_e2e22398263d4de8b795dfc67035a1f8~mv2.png/v1/fill/w_254,h_254,al_c,q_80,usm_0.66_1.00_0.01/Comunidades-Unidas-Logo.webp" alt="Comunidades Unidas Logo"
              />
              <div className="product-name">Tracker</div>
            </div>
          </Link>
        </li>
        <li>
          <Link to="add-client" className="nav-link" getProps={maybeActiveLink}>
            Add a client
          </Link>
        </li>
        <li>
          <Link to="report-issue" className="nav-link" getProps={maybeActiveLink}>
            Report an issue
          </Link>
        </li>
      </ul>
    </nav>
  )

  function maybeActiveLink({isCurrent}) {
    return isCurrent ? {style: {backgroundColor: '#f3f3f3'}} : null
  }
}

const css = `
& nav {
  position: fixed;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 236rem;
  background-color: white;
}

& .logo-row {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 22rem;
}

& .logo {
  height: 40rem;
}

& .product-name {
  padding-left: 16rem;
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
`