import React from "react";
import { useCss } from "kremling";
import { mediaDesktop, mediaMobile } from "../../styleguide.component";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import LeadSearchInput from "../../lead-search/lead-list/lead-search-input.component";

export default function LeadsTableToolbar(props) {
  const scope = useCss(css);

  const lastPage = Math.ceil(props.numLeads / props.pageSize);

  return (
    <div className="leads-table-toolbar" {...scope}>
      <div className="desktop-table-toolbar">
        <div className="left">
          <LeadSearchInput />
        </div>
        {lastPage !== 0 && (
          <div>
            <button className="icon">
              <img
                src={backIcon}
                alt="Go back one page"
                title="Go back one page"
              />
            </button>
            <button className="icon">
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
}

const css = `
	& .leads-table-toolbar {
		background-color: white;
		position: sticky;
		top: 0;
		left: 23.6rem;
		padding: 0 1.4rem;
		width: 100%;
		z-index: 100;
	}

	& .desktop-table-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	${mediaDesktop} {
		& .desktop-table-toolbar {
			flex-direction: row;
			height: 6rem;
		}

		& .left {
			width: 60%;
		}
	}

	${mediaMobile} {
		& .desktop-table-toolbar {
			flex-direction: column;
			justify-content: center;
			padding: .8rem;
		}
	}

	& .desktop-table-toolbar > * {
		display: flex;
		align-items: center;
	}
`;
