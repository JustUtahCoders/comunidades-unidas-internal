import React from "react";
import { Link } from "@reach/router";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";

export default function NotFound(props: NotFoundProps) {
  const scope = useCss(css);

  return (
    <div {...scope}>
      <PageHeader title="Oh no!" />
      <div className="not-found-page">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Please check the url and try again.</p>
        <p>
          If the url is correct and the error persists please feel free to
          report the issue.
        </p>
      </div>
    </div>
  );
}

const css = `
	& .not-found-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-contents: center;
		background-color: white;
		padding: 3rem 15rem 3rem 15rem;
	}

	& .not-found-page > h1 {
		font-size: 15rem;
		margin: 0 0 -6rem 0;
		color: var(--brand-color);
		text-shadow: black 3px 3px 1px;
	}

	& .not-found-page > h2 {
		font-size: 3.5rem;
		color: var(--brand-color);
	}

	& .not-found-page > p {
		font-size: 2rem;
		line-height: 3rem;
		margin: 0 0 1rem 0;
		text-align: center;
	}
`;

type NotFoundProps = {
  path: string;
};
