import React, { useEffect } from "react";
import { useCss, always, maybe } from "kremling";
import { mediaDesktop, mediaMobile } from "./styleguide.component";
import { UserModeContext, UserMode } from "./util/user-mode.context";
import { UserContext } from "./util/user.context";

export default function PageHeader(props: PageHeaderProps) {
  const scope = useCss(css);
  const user = React.useContext(UserContext);
  const { userMode, setUserMode } = React.useContext(UserModeContext);

  useEffect(() => {
    document.title = props.title + " - Comunidades Unidas";
  });

  const permissionsColor =
    userMode === UserMode.immigration ? "var(--immigration-color)" : null;

  const backgroundColor =
    props.backgroundColor || permissionsColor || "var(--brand-color)";

  return (
    <div
      {...scope}
      className={always("page-header box-shadow-1")
        .maybe(props.className || "", Boolean(props.className))
        .maybe("full-screen", props.fullScreen)
        .maybe("with-secondary-nav", props.withSecondaryNav)}
      style={{ backgroundColor }}
    >
      <h1>{props.title}</h1>
      {user.permissions.immigration && (
        <select
          value={userMode}
          onChange={(evt) => setUserMode(UserMode[evt.target.value])}
        >
          <option value={UserMode.normal}>Normal</option>
          <option value={UserMode.immigration}>Immigration</option>
        </select>
      )}
    </div>
  );
}

PageHeader.defaultProps = {
  title: "Database",
};

type PageHeaderProps = {
  title?: string;
  backgroundColor?: string;
  className?: string;
  fullScreen?: boolean;
  withSecondaryNav?: boolean;
};

const css = `
@media print {
  & .page-header {
    display: none !important;
  }
}

& .page-header {
  height: 10.2rem;
  display: flex;
  justify-content: space-between;
  color: white;
}

& .page-header h1 {
  font-weight: bold;
  margin: 0;
  padding: 0;
}

${mediaMobile} {
  & .page-header {
    padding: .8rem;
    align-items: flex-start;
  }

  & .page-header h1 {
    font-size: 2.8rem;
  }

  & .page-header select {
    align-self: flex-end;
  }
}

${mediaDesktop} {
  & .page-header {
    margin-bottom: 3.2rem;
    height: 18rem;
    padding: 3.2rem;
    align-items: flex-end;
  }

  & .page-header h1 {
    font-size: 3.2rem;
  }

  & .page-header.with-secondary-nav {
    margin-bottom: 0;
  }

  & .page-header.full-screen {
    margin-bottom: 0;
    height: 8rem;
    padding: 1.4rem;
  }

  & .page-header select {
    align-self: flex-start;
  }
}
`;
