import React from "react";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";

export default function LeadsTableToolbar(props: LeadsTableToolbarProps) {
  const scope = useCss(css);

  const lastPage = Math.ceil(props.numLeads / props.pageSize);

  return (
    <div className="leads-table-toolbar">
      <div className="desktop-table-toolbar">
        {lastPage !== 0 && (
          <div>
            <div>
              {(props.page - 1) * props.pageSize + 1} -{" "}
              {Math.min(props.page * props.pageSize, props.numLeads)} of{" "}
              {props.numLeads.toLocaleString()}
            </div>
            <button
              className="icon"
              onClick={goBack}
              disabled={props.page === 1}
            >
              <img
                src={backIcon}
                alt="Go back one page"
                title="Go back one page"
              />
            </button>
            <button
              className="icon"
              onClick={goForward}
              disabled={props.page === lastPage}
            >
              <img
                src={nextIcon}
                alt="Go forward one page"
                title="Go forward one page"
              />
            </button>
          </div>
        )}
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

`;

type LeadsTableToolbarProps = {
  numLeads: number;
  page: number;
  pageSize: number;
  setPage(pageNum: number): void;
  fetchingLead: boolean;
  refetchLeads: () => any;
};
