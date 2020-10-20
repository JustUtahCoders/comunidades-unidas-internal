import React from "react";
import { useCss } from "kremling";
import {
  boxShadow1,
  boxShadow2,
  mediaDesktop,
  mediaMobile,
} from "../styleguide.component";
import { Link } from "@reach/router";

export default function HomeCard(props: HomeCardProps) {
  const scope = useCss(css);

  return (
    <div className="card-container" {...scope}>
      <Link className="home-card unstyled" to={props.link}>
        <img src={props.iconUrl} className="icon" alt={props.alt} />
        <div className="title">{props.title}</div>
      </Link>
    </div>
  );
}

const css = `
& .home-card.unstyled {
  border-radius: .3rem;
  background-color: white;
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${boxShadow1};
  margin-bottom: 2.4rem;
}

${mediaMobile} {
  & .home-card {
    height: 15rem;
    width: 15rem;
  }

  & .card-container {
    flex-basis: 17.4rem;
  }

  & .icon {
    height: 3.2rem;
    width: 3.2rem;
  }
}

${mediaDesktop} {
  & .home-card {
    height: 20rem;
    width: 20rem;
  }

  & .card-container {
    flex-basis: 22.4rem;
  }

  & .home-card.unstyled:first-child {
    margin-left: 0;
  }

  & .icon {
    height: 6.4rem;
    width: 6.4rem;
  }
}

& .home-card:hover {
  box-shadow: ${boxShadow2};
}

& .icon {
  margin-bottom: 1.6rem;
}

& .title {
  text-align: center;
}
`;

type HomeCardProps = {
  title: string;
  iconUrl: string;
  link: string;
  alt: string;
};
