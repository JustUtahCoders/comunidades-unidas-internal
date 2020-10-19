import React from "react";
import HomeCard from "../../home/home-card.component";
import caseNoteUrl from "../../../icons/148705-essential-collection/svg/note.svg";
import recordVisitUrl from "../../../icons/148705-essential-collection/svg/hourglass-2.svg";
import filesUrl from "../../../icons/148705-essential-collection/svg/folder-19.svg";
import invoicesUrl from "../../../icons/148705-essential-collection/svg/price-tag.svg";
import { useCss } from "kremling";
import { SingleClient } from "../view-client.component";

export default function ClientAddNewInfo(props: ClientAddNewInfoProps) {
  const scope = useCss(css);

  return (
    <div className="client-add-info-cards" {...scope}>
      <HomeCard
        iconUrl={caseNoteUrl}
        title="Add case note"
        alt="Notebook"
        link={`/clients/${props.clientId}/add-case-note`}
      />
      <HomeCard
        iconUrl={recordVisitUrl}
        title="Add client interaction"
        alt="Hour Glass"
        link={`/clients/${props.clientId}/add-client-interaction`}
      />
      <HomeCard
        iconUrl={filesUrl}
        title="Add files"
        alt="Filing cabinet folder"
        link={`/clients/${props.clientId}/files`}
      />
      <HomeCard
        iconUrl={invoicesUrl}
        title="Add Invoice / Payment"
        alt="Price tag"
        link={`/clients/${props.clientId}/invoices`}
      />
    </div>
  );
}

const css = `
  & .client-add-info-cards {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 2.4rem;
    margin-left: 2.4rem;
  }
`;

type ClientAddNewInfoProps = {
  clientId: string;
  client: SingleClient;
  setClient(client: SingleClient): any;
  path: string;
};
