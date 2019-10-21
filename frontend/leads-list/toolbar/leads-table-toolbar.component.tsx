// import React from "react";
// import { useCss } from "kremling";
// import { mediaDesktop, mediaMobile } from "../../styleguide.component";
// import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
// import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
// import LeadSearchInput from "../../lead-search/lead-list/lead-search-input.component";

// export default function LeadsTableToolbar(props: LeadsTableToolbarProps) {
//   const scope = useCss(css);

//   const lastPage = Math.ceil(props.numLeads / props.pageSize);

//   return (
//     <div className="leads-table-toolbar" {...scope}>
//       <div className="desktop-table-toolbar">
//         <div className="left">
//           <LeadSearchInput />
//         </div>
//         {lastPage !== 0 && (
//           <div>
//             <div>
//               {(props.page - 1) * props.pageSize + 1} -{" "}
//               {Math.min(props.page * props.pageSize, props.numLeads)} of{" "}
//               {props.numLeads.toLocaleString()}
//             </div>
//             <button
//               className="icon"
//               onClick={goBack}
//               disabled={props.page === 1}
//             >
//               <img
//                 src={backIcon}
//                 alt="Go back one page"
//                 title="Go back one page"
//               />
//             </button>
//             <button
//               className="icon"
//               onClick={goForward}
//               disabled={props.page === lastPage}
//             >
//               <img
//                 src={nextIcon}
//                 alt="Go forward one page"
//                 title="Go forward one page"
//               />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   function goBack() {
//     props.setPage(props.page - 1);
//   }

//   function goForward() {
//     props.setPage(props.page + 1);
//   }
// }

// const css = `
// 	& .leads-table-toolbar {
// 		background-color: white;
// 		position: sticky;
// 		top: 0;
// 		left: 23.6rem;
// 		padding: 0 1.4rem;
// 		width: 100%;
// 		z-index: 100;
// 	}

// 	& .desktop-table-toolbar {
// 		display: flex;
// 		justify-content: space-between;
// 		align-items: center;
// 	}

// 	${mediaDesktop} {
// 		& .desktop-table-toolbar {
// 			flex-direction: row;
// 			height: 6rem;
// 		}

// 		& .left {
// 			width: 60%;
// 		}
// 	}

// 	${mediaMobile} {
// 		& .desktop-table-toolbar {
// 			flex-direction: column;
// 			justify-content: center;
// 			padding: .8rem;
// 		}
// 	}

// 	& .desktop-table-toolbar > * {
// 		display: flex;
// 		align-items: center;
// 	}
// `;

// type LeadsTableToolbarProps = {
//   numLeads: number;
//   pageSize: number;
//   page: number;
//   setPage: any;
//   fetchingLeads: boolean;
//   refetchLeads: any;
// };
