import React, { useEffect } from "react";
import { useCss, always, maybe } from "kremling";
import { mediaDesktop, mediaMobile } from "./styleguide.component";

export default function PageHeader(props: PageHeaderProps) {
  const scope = useCss(css);

  useEffect(() => {
    document.title = props.title + " - Comunidades Unidas";
  });

  return (
    <div
      {...scope}
      className={always("page-header box-shadow-1")
        .maybe(props.className || "", Boolean(props.className))
        .maybe("full-screen", props.fullScreen)
        .maybe("with-secondary-nav", props.withSecondaryNav)}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <h1>{props.title}</h1>
    </div>
  );
}

PageHeader.defaultProps = {
  title: "Database",
  backgroundColor: `var(--brand-color)`
};

type PageHeaderProps = {
  title?: string;
  backgroundColor?: string;
  className?: string;
  fullScreen?: boolean;
  withSecondaryNav?: boolean;
};

const css = `
& .page-header {
  height: 10.2rem;
  display: flex;
}

& .page-header h1 {
  color: white;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

${mediaMobile} {
  & .page-header {
    padding: .8rem;
    align-items: flex-start;
    font-size: 1.6rem;
  }
}

${mediaDesktop} {
  & .page-header {
    margin-bottom: 3.2rem;
    height: 18rem;
    padding: 3.2rem;
    align-items: flex-end;
    font-size: 2.4rem;
  }

  & .page-header.with-secondary-nav {
    margin-bottom: 0;
  }

  & .page-header.full-screen {
    margin-bottom: 0;
    height: 8rem;
    padding: 1.4rem;
  }
}
`;
