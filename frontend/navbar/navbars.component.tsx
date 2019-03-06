import React from 'react'
import Sidebar from './sidebar.component'
import {useCss} from 'kremling'

type NavbarsProps = {
  path: string,
  children?: JSX.Element | JSX.Element[],
}

export default function Navbars(props: NavbarsProps) {
  const scope = useCss(css)

  return (
    <>
      <Sidebar />
      <div className="left-of-sidebar" {...scope}>
        <div className="main-content">
          {props.children}
        </div>
      </div>
    </>
  )
}

const css = `
& .main-content {
  margin: 0 auto;
  width: 75%;
}

& .left-of-sidebar {
  margin-left: 236rem;
}
`