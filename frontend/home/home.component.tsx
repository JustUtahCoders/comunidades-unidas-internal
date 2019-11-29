import React from "react";
import PageHeader from "../page-header.component";
import HomeCard from "./home-card.component";
import addClientIconUrl from "../../icons/148705-essential-collection/svg/add-1.svg";
import reportIssueUrl from "../../icons/148705-essential-collection/svg/info.svg";
import recordVisitUrl from "../../icons/148705-essential-collection/svg/hourglass-2.svg";
import clientListUrl from "../../icons/148705-essential-collection/svg/folder-14.svg";
import caseNoteUrl from "../../icons/148705-essential-collection/svg/note.svg";
import leadListUrl from "../../icons/148705-essential-collection/svg/list-1.svg";
import addLeadsUrl from "../../icons/148705-essential-collection/svg/windows-3.svg";
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
        />
        <HomeCard
          iconUrl={addClientIconUrl}
          title="Add a new client"
          link="add-client"
        />
        <HomeCard
          iconUrl={recordVisitUrl}
          title="Add a client interaction"
          link="add-client-interaction"
        />
        <HomeCard
          iconUrl={caseNoteUrl}
          title="Add a case note"
          link="add-case-note"
        />
        <HomeCard iconUrl={leadListUrl} title="Lead list" link="lead-list" />
        <HomeCard iconUrl={addLeadsUrl} title="Add Leads" link="add-leads" />
        <HomeCard
          iconUrl={reportIssueUrl}
          title="Question, issue, or idea"
          link="report-issue"
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
