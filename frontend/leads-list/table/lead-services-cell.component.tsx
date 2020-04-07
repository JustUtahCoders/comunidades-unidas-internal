import React from "react";
import { useCss } from "kremling";
import preventiveHealthIcon from "../../../icons/services-icons/svg/003-caduceus.svg";
import nutritionIcon from "../../../icons/services-icons/svg/009-fruit.svg";
import immigrationIcon from "../../../icons/services-icons/svg/027-usa-today-2.svg";
import financeIcon from "../../../icons/services-icons/svg/038-money-2.svg";
import workerRightsIcon from "../../../icons/services-icons/svg/064-hand-holding-up-a-wrench.svg";
import familySupportIcon from "../../../icons/services-icons/svg/061-family-house.svg";
import communityEngagementIcon from "../../../icons/services-icons/svg/055-megaphone.svg";
import focusGroupsIcon from "../../../icons/services-icons/svg/070-lightbulb-idea.svg";
import snapIcon from "../../../icons/services-icons/svg/stamp.png";
import unknownIcon from "../../../icons/148705-essential-collection/svg/info.svg";
import { groupBy } from "lodash-es";

export default function LeadServicesCell(props: LeadServicesCellProps) {
  const scope = useCss(css);
  const allServices = props.programData.services || [];
  const leadServices = props.leadServices.map((sid) =>
    allServices.find((ser) => ser.id === sid)
  );
  const leadServicesByName = groupBy(leadServices, "programName");

  return (
    <>
      <div className="programs-cell" {...scope}>
        {leadServices.length > 0 ? (
          Object.keys(leadServicesByName).map((programName) => (
            <div className="icon-container" key={programName}>
              <img
                className="program-icon"
                alt={`icon - ${leadServicesByName}`}
                src={getIconUrl(programName)}
                title={`${programName} (${leadServicesByName[programName].length})`}
              />
            </div>
          ))
        ) : (
          <p>{"\u2014"}</p>
        )}
      </div>
    </>
  );

  function getIconUrl(programName) {
    switch (programName) {
      case "Preventive Health":
        return preventiveHealthIcon;
      case "Nutrition / CRYS":
        return nutritionIcon;
      case "Immigration":
        return immigrationIcon;
      case "Financial Education / Coaching":
        return financeIcon;
      case "Workers' Rights":
        return workerRightsIcon;
      case "Family Support":
        return familySupportIcon;
      case "Community Engagement and Organizing":
        return communityEngagementIcon;
      case "Focus Groups":
        return focusGroupsIcon;
      case "SNAP":
        return snapIcon;
      default:
        return unknownIcon;
    }
  }
}

const css = `
  & .programs-cell {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  & .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;
  }
  
  & .program-icon {
    height: 2rem;
    margin-right: 0.35rem;
  }
`;

type LeadServicesCellProps = {
  leadServices: Array<number>;
  programData: any;
};
