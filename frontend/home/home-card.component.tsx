import React from "react";
import { useCss } from "kremling";
import {
  boxShadow1,
  boxShadow2,
  mediaDesktop,
  mediaMobile
} from "../styleguide.component";
import { Link } from "@reach/router";

export default function HomeCard(props: HomeCardProps) {
  const scope = useCss(css);

  return (
    <div className="card-container" {...scope}>
      <Link className="home-card unstyled" to={props.link}>
        <img src={props.iconUrl} className="icon" />
        <div className="title">{props.title}</div>
      </Link>
    </div>
  );
}

const css = `
& .home-card.unstyled {
  border-radius: 25pt;
  background-color: white;
  padding: 1vh 1vw 1vh 1vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${boxShadow1};
  margin-bottom: 5vh;
}

${mediaMobile} {
  & .home-card {
    height: 150rem;
    width: 150rem;
  }

  & .card-container {
    flex-basis: 174rem;
  }

  & .icon {
    height: 32rem;
    width: 32rem;
  }
}

${mediaDesktop} {
  & .home-card {
    height: 20vh;
    width: calc(20vh);
  }

  & .card-container {
    flex-basis: 10vw;
  }

  & .home-card.unstyled:first-child {
    margin-left: 0;
  }

  & .icon {
    height: 6.5vh;
    width: calc(6.5vh);
    
  }
}

& .home-card:hover {
  box-shadow: ${boxShadow2};
}

& .icon {
  margin-bottom: 2vh;
}

& .title {
  font-size: 2vh;
  text-align: center;
}
`;

type HomeCardProps = {
  title: string;
  iconUrl: string;
  link: string;
};
