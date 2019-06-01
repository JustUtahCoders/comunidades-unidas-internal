import React from "react";
import { ClientsTableToolbarProps } from "./clients-table-toolbar.component";
import { useCss } from "kremling";
import { boxShadow2 } from "../../styleguide.component";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";

export default function DesktopTableToolbar(props: ClientsTableToolbarProps) {
  const scope = useCss(css);
  const [selectAll, setSelectAll] = React.useState(false);

  return (
    <div className="desktop-table-toolbar" {...scope}>
      <div>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={evt => setSelectAll(evt.target.checked)}
          name="select-all"
        />
      </div>
      <div>
        <div>
          {(props.page - 1) * props.pageSize + 1} -{" "}
          {Math.min(props.page * props.pageSize, props.numClients)} of{" "}
          {props.numClients.toLocaleString()}
        </div>
        <button className="icon" onClick={goBack} disabled={props.page === 1}>
          <img src={backIcon} alt="Go back one page" title="Go back one page" />
        </button>
        <button
          className="icon"
          onClick={goForward}
          disabled={props.page === Math.ceil(props.numClients / props.pageSize)}
        >
          <img
            src={nextIcon}
            alt="Go forward one page"
            title="Go forward one page"
          />
        </button>
      </div>
    </div>
  );

  function goBack() {
    props.setPage(props.page - 1);
  }

  function goForward() {
    props.setPage(props.page + 1);
  }
}

const css = `
& .desktop-table-toolbar {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.4rem;
  box-shadow: ${boxShadow2};
  position: sticky;
  top: 0;
  left: 23.6rem;
  width: 100%;
  height: 6rem;
}

& .desktop-table-toolbar > * {
  display: flex;
  align-items: center;
}
`;
