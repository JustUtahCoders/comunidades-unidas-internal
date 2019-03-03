import React from 'react'
import {Router} from '@reach/router'
import AddClient from './add-client/add-client.component'
import Navbars from './navbar/navbars.component'
import Styleguide from './styleguide.component'
import Home from './home/home.component'

export default function Root() {
  return (
    <Styleguide>
      <Router>
        <Navbars path="/">
          <Home path="/" exact />
          <AddClient path="/add-client" />
        </Navbars>
      </Router>
    </Styleguide>
  )
}