import React from "react";
import { useCss } from "kremling";
import { mediaMobile, mediaDesktop } from "../styleguide.component";

export default function StickySecondaryNav(props: StickySecondaryNavProps) {
  const scope = useCss(css);
  return (
    <nav className="sticky-secondary-nav" {...scope}>
      {props.children}
    </nav>
  );
}

const css = `
& .sticky-secondary-nav {
  position: sticky;
  background-color: var(--brand-color);
  color: white;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow-x: auto;
  z-index: 100;
}

& .sticky-secondary-nav ul, & .sticky-secondary-nav li {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

& .sticky-secondary-nav a:visited, & .sticky-secondary-nav a {
  color: white;
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.6rem;
}

& .sticky-secondary-nav a.active {
  background-color: rgba(139, 0, 0, 1);
}

& .sticky-secondary-nav a:hover {
  background-color: rgba(139, 0, 0, 0.6);
}

${mediaMobile} {
  & .sticky-secondary-nav {
    top: 5.6rem;
    height: 4rem;
  }
}

${mediaDesktop} {
  & .sticky-secondary-nav {
    top: 0;
    height: 6rem;
    margin-bottom: 3.2rem;
  }
}
`;

type StickySecondaryNavProps = {} & JSX.ElementChildrenAttribute;
