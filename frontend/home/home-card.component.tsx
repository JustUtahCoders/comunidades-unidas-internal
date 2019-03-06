import React from 'react'
import {useCss} from 'kremling'
import {boxShadow1, boxShadow2} from '../styleguide.component'
import {Link} from '@reach/router'

export default function HomeCard(props: HomeCardProps) {
  const scope = useCss(css)

  return (
    <Link {...scope} className="home-card unstyled" to="add-client">
      <img src={props.iconUrl} className="icon" />
      <div className="title">
        {props.title}
      </div>
    </Link>
  )
}

const css = `
& .home-card.unstyled {
  border-radius: 3rem;
  width: 200rem;
  height: 200rem;
  background-color: white;
  padding: 32rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${boxShadow1};
}

& .home-card:hover {
  box-shadow: ${boxShadow2};
}

& .icon {
  height: 64rem;
  width: 64rem;
  margin-bottom: 16rem;
}

& .title {
  text-align: center;
}
`

type HomeCardProps = {
  title: string,
  iconUrl: string,
}