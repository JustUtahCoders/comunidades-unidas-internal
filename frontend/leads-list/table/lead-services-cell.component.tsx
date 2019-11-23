import React from "react";
import { useCss } from "kremling";
import preventiveHealthIcon from "../../../icons/148705-essential-collection/svg/003-caduceus.svg";
import nutritionIcon from "../../../icons/148705-essential-collection/svg/009-fruit.svg";
import immigrationIcon from "../../../icons/148705-essential-collection/svg/027-usa-today-2.svg";
import financeIcon from "../../../icons/148705-essential-collection/svg/038-money-2.svg";
import workerRightsIcon from "../../../icons/148705-essential-collection/svg/064-hand-holding-up-a-wrench.svg";
import familySupportIcon from "../../../icons/148705-essential-collection/svg/061-family-house.svg";
import communityEngagementIcon from "../../../icons/148705-essential-collection/svg/055-megaphone.svg";
import focusGroupsIcon from "../../../icons/148705-essential-collection/svg/070-lightbulb-idea.svg";

export default function LeadServicesCell(props: LeadServicesCellProps) {
  const { leadServices } = props;

  const [healthServices, setHealthServices] = React.useState([]);
  const [nutritionServices, setNutritionServices] = React.useState([]);
  const [immigrationServices, setImmigrationServices] = React.useState([]);
  const [financialServices, setFinancialServices] = React.useState([]);
  const [workersRightsServices, setWorkersRightsServices] = React.useState([]);
  const [familySupportServices, setFamilySupportServices] = React.useState([]);
  const [
    communityEngagementServices,
    setCommunityEngagementServices
  ] = React.useState([]);
  const [focusGroupServices, setFocusGroupServices] = React.useState([]);

  const scope = useCss(css);

  React.useEffect(() => {
    const filterHealthServices = leadServices.filter(
      service => service.programId === 1
    );
    setHealthServices(filterHealthServices);

    const filterNutritionServices = leadServices.filter(
      service => service.programId === 2
    );
    setNutritionServices(filterNutritionServices);

    const filterImmigrationServices = leadServices.filter(
      service => service.programId === 3
    );
    setImmigrationServices(filterImmigrationServices);

    const filterFinancialServices = leadServices.filter(
      service => service.programId === 4
    );
    setFinancialServices(filterFinancialServices);

    const filterWorkersRightsServices = leadServices.filter(
      service => service.programId === 5
    );
    setWorkersRightsServices(filterWorkersRightsServices);

    const filterFamilySupportServices = leadServices.filter(
      service => service.programId === 6
    );
    setFamilySupportServices(filterFamilySupportServices);

    const filterCommunityServices = leadServices.filter(
      service => service.programId === 7
    );
    setCommunityEngagementServices(filterCommunityServices);

    const filterFocusGroupServices = leadServices.filter(
      service => service.programId === 8
    );
    setFocusGroupServices(filterFocusGroupServices);
  }, []);

  return (
    <>
      {leadServices.length > 0 ? (
        <div className="programs-cell" {...scope}>
          {healthServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="health-icon"
                src={preventiveHealthIcon}
                title="Preventive Health"
              />
              <span>( {healthServices.length} )</span>
            </div>
          )}
          {nutritionServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="nutrition-icon"
                src={nutritionIcon}
                title="Nutrition / CRYS / SNAP"
              />
              <span>( {nutritionServices.length} )</span>
            </div>
          )}
          {immigrationServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="immigration-icon"
                src={immigrationIcon}
                title="Immigration"
              />
              <span>( {immigrationServices.length} )</span>
            </div>
          )}
          {financialServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="financial-icon"
                src={financeIcon}
                title="Financial Education / Coaching"
              />
              <span>( {financialServices.length} )</span>
            </div>
          )}
          {workersRightsServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="workers-rights-icon"
                src={workerRightsIcon}
                title="Workers' Rights"
              />
              <span>( {workersRightsServices.length} )</span>
            </div>
          )}
          {familySupportServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="family-services-icon"
                src={familySupportIcon}
                title="Family Support"
              />
              <span>( {familySupportServices.length} )</span>
            </div>
          )}
          {communityEngagementServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="community-engagement-icon"
                src={communityEngagementIcon}
                title="Community Engagement and Organizing"
              />
              <span>( {communityEngagementServices.length} )</span>
            </div>
          )}
          {focusGroupServices.length > 0 && (
            <div className="icon-container">
              <img
                className="program-icon"
                alt="focus-groups-icon"
                src={focusGroupsIcon}
                title="Focus Group"
              />
              <span>( {focusGroupServices.length} )</span>
            </div>
          )}
        </div>
      ) : (
        <p>No services selected</p>
      )}
    </>
  );
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

  .icon-container {
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
  leadServices: Array<LeadService>;
};

type LeadService = {
  id?: number;
  serviceName?: string;
  programId?: number;
  programName?: string;
};
