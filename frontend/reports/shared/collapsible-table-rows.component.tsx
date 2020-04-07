import React from "react";
import { maybe, toggle, useCss, always } from "kremling";

export default function CollapsibleTableRows(props: CollapsibleTableRowsProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(
    Boolean(!props.startExpanded)
  );
  const scope = useCss(css);

  React.useEffect(() => {
    window.addEventListener("toggleReportCollapseRows", toggleAllHandler);

    return () => {
      window.removeEventListener("toggleReportCollapseRows", toggleAllHandler);
    };

    function toggleAllHandler(evt: CustomEvent) {
      setIsCollapsed(evt.detail.isCollapsed);
    }
  });

  return (
    <>
      {React.cloneElement(props.everpresentRow, {
        onClick: handleClick,
        className: always("collapsible-row").always(
          props.everpresentRow.props.className
        ),
        ...scope,
        children: React.Children.map(
          props.everpresentRow.props.children,
          (tableCell, index) => {
            if (
              tableCell.props.children &&
              tableCell.props.children.type === ToggleCollapseButton
            ) {
              return (
                <td key={index}>
                  <button
                    type="button"
                    className={toggle("primary", "secondary", isCollapsed)}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setIsCollapsed(!isCollapsed);
                    }}
                  >
                    {isCollapsed ? "Expand" : "Collapse"}
                  </button>
                </td>
              );
            } else {
              return React.cloneElement(tableCell, { key: index });
            }
          }
        ),
      })}
      {!isCollapsed && props.collapsibleRows}
    </>
  );

  function handleClick(evt) {
    if (!props.onlyButtonClick) {
      setIsCollapsed(!isCollapsed);
    }
  }
}

export function ToggleCollapseButton(props) {
  return <button type="button" />;
}

export function ToggleAllButton(props) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  return (
    <button
      type="button"
      onClick={toggleAll}
      className={toggle("primary", "secondary", isCollapsed)}
    >
      {isCollapsed ? "Expand all" : "Collapse all"}
    </button>
  );

  function toggleAll() {
    window.dispatchEvent(
      new CustomEvent("toggleReportCollapseRows", {
        detail: {
          isCollapsed: !isCollapsed,
        },
      })
    );
    setIsCollapsed(!isCollapsed);
  }
}

const css = `
& .collapsible-row:not(:first-child) {
  border-top: .2rem solid black;
}
`;

type CollapsibleTableRowsProps = {
  startExpanded?: boolean;
  everpresentRow: JSX.Element;
  collapsibleRows: JSX.Element[];
  onlyButtonClick?: boolean;
};
