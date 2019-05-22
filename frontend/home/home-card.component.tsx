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
  border-radius: 3rem;
  background-color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${boxShadow1};
  margin-bottom: 2rem;
}

${mediaMobile} {
  & .home-card {
    height: 14rem;
    width: 14rem;
    font-size: 1.75rem;
  }

  & .card-container {
    flex-basis: 14rem;
  }

  & .icon {
    height: 4rem;
    width: 4rem;
  }
}

${mediaDesktop} {
  & .home-card {
    height: 20rem;
    width: 20rem;
    font-size: 2rem;
  }

  & .card-container {
    flex-basis: 22rem;
  }

  & .home-card.unstyled:first-child {
    margin-left: 0;
  }

  & .icon {
    height: 8rem;
    width: 8rem;
  }
}

& .home-card:hover {
  box-shadow: ${boxShadow2};
}

& .icon {
  margin-bottom: 2rem;
}

& .title {
  text-align: center;
}
`;

type HomeCardProps = {
  title: string;
  iconUrl: string;
  link: string;
};
