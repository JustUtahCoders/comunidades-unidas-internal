import React from "react";
import { ClientsTableToolbarProps } from "./clients-table-toolbar.component";
import { useCss } from "kremling";
import { boxShadow2 } from "../../styleguide.component";

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
        {(props.page - 1) * props.pageSize + 1} -{" "}
        {Math.min(props.page * props.pageSize, props.numClients)} of{" "}
        {props.numClients.toLocaleString()}
      </div>
    </div>
  );
}

const css = `
& .desktop-table-toolbar {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.4rem;
  box-shadow: ${boxShadow2};
  position: fixed;
  left: 23.6rem;
  width: calc(100% - 23.6rem);
  height: 8rem;
}

& .desktop-table-toolbar > * {
  display: flex;
  align-items: center;
}
`;
