import React from "react";
import { navigate } from "@reach/router";
import { useCss } from "kremling";

export default function SelectReport(props: SelectReportProps) {
  const scope = useCss(css);

  return (
    <>
      {!window.location.pathname.endsWith("/results") && (
        <div className="select-report" {...scope}>
          <label id="select-report-label">Report: </label>
          <select
            onChange={(evt) =>
              navigate(`/reports/${evt.target.value}${window.location.search}`)
            }
            value={
              window.location.pathname.slice("/reports/".length) ||
              "interaction-hours-by-client"
            }
            style={{ maxWidth: "100%", width: "100%" }}
            aria-labelledby="select-report-label"
          >
            {React.Children.map(
              React.Children.only(props.children).props.children,
              (child) =>
                child.props.path &&
                child.props.title && (
                  <option value={child.props.path}>{child.props.title}</option>
                )
            )}
          </select>
        </div>
      )}
      {props.children}
    </>
  );
}

type SelectReportProps = {
  children: any;
};

const css = `
& .select-report {
  display: flex;
  align-items: center;
  padding: 3.2rem 3.2rem 0 3.2rem;
}

& .select-report select {
  margin-left: .8rem;
}
`;
