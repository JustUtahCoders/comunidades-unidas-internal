import React from 'react'
import {Router} from '@reach/router'
import AddContact from './add-contact/add-contact.component'

export default function Root() {
  return (
    <Router>
      <AddContact path="/" />
    </Router>
  )
}