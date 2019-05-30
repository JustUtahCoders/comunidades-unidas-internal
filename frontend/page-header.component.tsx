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
  height: 10.2rem;
  padding: 3.2rem;
  display: flex;
  align-items: flex-end;
}

& .page-header h1 {
  color: white;
  font-weight: bold;
  font-size: 3.2rem;
  margin: 0;
  padding: 0;
}

${mediaDesktop} {
  & .page-header {
    margin-bottom: 3.2rem;
    height: 18rem;
  }
}
`;
