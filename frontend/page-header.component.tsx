import React, { useEffect } from "react";
import { useCss, always, maybe } from "kremling";
import { brandColor, mediaDesktop } from "./styleguide.component";

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
  width: 61vw;
  padding: 10vh 0vw;
  display: flex;
  align-items: center;
  justify-contents: center;
}

${mediaDesktop} {
  & .page-header {
    margin-bottom: 5vh;
    height: 5vh;
  }
}

& .page-header h1 {
  color: white;
  font-weight: bold;
  font-size: 4vh;
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 0;
}
`;
