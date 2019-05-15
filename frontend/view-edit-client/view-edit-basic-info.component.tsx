import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import dayjs from "dayjs";
import { useCss } from "kremling";

export default function ViewEditBasicInfo(props: ViewEditBasicInfoProps) {
  const scope = useCss(css);

  return (
    <ClientSection title="Basic information">
      <div {...scope} className="view-basic-info">
        {props.client.fullName} - {props.client.gender} -{" "}
        {dayjs(props.client.birthday).format("M/D/YYYY")}
      </div>
    </ClientSection>
  );
}

type ViewEditBasicInfoProps = {
  client: SingleClient;
};

const css = `
& .view-basic-info {
  display: flex;
  justify-content: center;
}
`;
