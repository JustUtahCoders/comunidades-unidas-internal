import React from "react";
import HomeCard from "../home/home-card.component";
import PageHeader from "../page-header.component";
import programsServicesIcon from "../../icons/148705-essential-collection/svg/switch-4.svg";
import partnersIcon from "../../icons/148705-essential-collection/svg/switch-5.svg";
import usersIcon from "../../icons/148705-essential-collection/svg/users-1.svg";
import css from "./admin-settings.css";
import { useCss } from "kremling";

export default function AdminSettings(props) {
  return (
    <>
      <PageHeader title="Admin Settings" />
      <div className="home-cards" {...useCss(css)}>
        <HomeCard
          title="Programs and Services"
          link="/programs-and-services"
          iconUrl={programsServicesIcon}
          alt="Toggle Switch"
        />
        <HomeCard
          title="Partners"
          link="/partners"
          iconUrl={partnersIcon}
          alt="Filled toggle switch"
        />
        <HomeCard
          title="User Permissions"
          link="/user-permissions"
          iconUrl={usersIcon}
          alt="Person shadowed outline"
        />
      </div>
    </>
  );
}
