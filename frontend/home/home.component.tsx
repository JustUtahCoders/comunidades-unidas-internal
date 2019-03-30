import React from 'react'
import PageHeader from '../page-header.component'
import HomeCard from './home-card.component'
import addClientIconUrl from '../../icons/148705-essential-collection/svg/add-1.svg'
import reportIssueUrl from '../../icons/148705-essential-collection/svg/info.svg'
import {useCss} from 'kremling'
import { mediaMobile } from '../styleguide.component';

export default function Home(props: HomeProps) {
  const scope = useCss(css)

  return (
    <div {...scope}>
      <PageHeader title="Database" />
      <div className="home-cards">
        <HomeCard
          iconUrl={addClientIconUrl}
          title="Add a new client"
          link="add-client"
        />
        <HomeCard
          iconUrl={reportIssueUrl}
          title="Question, issue, or idea"
          link="report-issue"
        />
      </div>
    </div>
  )
}

const css = `
& .home-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 24rem;
  margin-left: 24rem;
}
`

type HomeProps = {
  path: string,
  exact?: boolean,
}