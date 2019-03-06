import React from 'react'
import PageHeader from '../page-header.component'
import HomeCard from './home-card.component'
import iconUrl from '../../icons/148705-essential-collection/svg/add-1.svg'

export default function Home(props: HomeProps) {
  return (
    <div>
      <PageHeader title="Client Tracker" />
      <HomeCard
        iconUrl={iconUrl}
        title="Add a new client"
      />
    </div>
  )
}

type HomeProps = {
  path: string,
  exact?: boolean,
}