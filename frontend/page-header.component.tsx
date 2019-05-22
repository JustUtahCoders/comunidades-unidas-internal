import React, { useEffect } from "react";
import { useCss, always, maybe } from "kremling";
import { brandColor, mediaDesktop, mediaMobile } from "./styleguide.component";

export default function PageHeader(props: PageHeaderProps) {
  const scope = useCss(css);

  useEffect(() => {
    document.title = props.title + " - Comunidades Unidas";
  });

  return (
    <div
      {...scope}
      className={always("page-header box-shadow-1").maybe(
        props.className || "",
        Boolean(props.className)
      )}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <h1>{props.title}</h1>
    </div>
  );
}

PageHeader.defaultProps = {
  title: "Database",
  backgroundColor: brandColor
};

type PageHeaderProps = {
  title?: string;
  backgroundColor?: string;
  className?: string;
};

const css = `
& .page-header {
  height: 10rem;
  padding: 5rem;
  display: flex;
  align-items: flex-end;
}

& .page-header h1 {
  color: white;
  font-weight: bold;
  font-size: 3rem;
  margin: 0;
  padding: 0;
}

${mediaDesktop} {
  & .page-header {
    margin-bottom: 3rem;
    height: 18rem;
    width: 84rem;
  }
}

${mediaMobile} {
  & .page-header {
    margin-top: 9rem;
    padding: 3rem 2rem 3rem 2rem;
    height: 15rem;
    width: 100%;
  }

  & .page-header h1 {
    font-size: 2.75rem;
  }
}
`;
