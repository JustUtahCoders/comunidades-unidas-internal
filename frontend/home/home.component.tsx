import React from "react";
import PageHeader from "../page-header.component";
import HomeCard from "./home-card.component";
import addClientIconUrl from "../../icons/148705-essential-collection/svg/add-1.svg";
import reportIssueUrl from "../../icons/148705-essential-collection/svg/info.svg";
import recordVisitUrl from "../../icons/148705-essential-collection/svg/hourglass-2.svg";
import clientListUrl from "../../icons/148705-essential-collection/svg/folder-14.svg";
import caseNoteUrl from "../../icons/148705-essential-collection/svg/note.svg";
import leadListUrl from "../../icons/148705-essential-collection/svg/list-1.svg";
import reportsUrl from "../../icons/148705-essential-collection/svg/volume-control-1.svg";
import addLeadsUrl from "../../icons/148705-essential-collection/svg/windows-3.svg";
import eventListUrl from "../../icons/148705-essential-collection/svg/calendar-1.svg";
import adminUrl from "../../icons/148705-essential-collection/svg/settings-1.svg";
import invoicesUrl from "../../icons/148705-essential-collection/svg/price-tag.svg";
import { useCss } from "kremling";

export default function Home(props: HomeProps) {
  const scope = useCss(css);

  return (
    <div {...scope}>
      <PageHeader title="Comunidades Unidas Database" />
      <div className="home-cards">
        <HomeCard
          iconUrl={clientListUrl}
          title="Client list"
          link="client-list"
          alt="Folder with documents"
        />
        <HomeCard
          iconUrl={addClientIconUrl}
          title="Add a new client"
          link="add-client"
          alt="Large plus sign"
        />
        <HomeCard
          iconUrl={recordVisitUrl}
          title="Add a client interaction"
          link="add-client-interaction"
          alt="Hour Glass"
        />
        <HomeCard
          iconUrl={caseNoteUrl}
          title="Add a case note"
          link="add-case-note"
          alt="Paper notebook"
        />
        <HomeCard
          iconUrl={leadListUrl}
          title="Lead list"
          link="lead-list"
          alt="Document with bulleted list"
        />
        <HomeCard
          iconUrl={eventListUrl}
          title="Events List"
          link="event-list"
          alt="Calendar"
        />
        <HomeCard
          iconUrl={adminUrl}
          title="Admin Settings"
          link="admin-settings"
          alt="Gears"
        />
        <HomeCard
          iconUrl={addLeadsUrl}
          title="Add Leads"
          link="add-leads"
          alt="Multiple layered surfaces"
        />
        <HomeCard
          iconUrl={reportsUrl}
          title="Reports"
          link="reports"
          alt="Dial showing Low to High"
        />
        <HomeCard
          iconUrl={invoicesUrl}
          title="Invoices"
          link="invoices"
          alt="Price tag"
        />
        <HomeCard
          iconUrl={reportIssueUrl}
          title="Question, issue, or idea"
          link="report-issue"
          alt="Question mark"
        />
      </div>
    </div>
  );
}

const css = `
& .home-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2.4rem;
  margin-left: 2.4rem;
}

`;

type HomeProps = {
  path: string;
  exact?: boolean;
};
