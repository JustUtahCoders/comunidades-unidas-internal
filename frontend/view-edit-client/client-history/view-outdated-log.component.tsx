import React from "react";
import Modal from "../../util/modal.component";
import { ClientLog } from "./client-history.component";
import { startCase } from "lodash-es";
import { useCss } from "kremling";

export default function ViewOutdatedLog(props: ViewOutdatedLogProps) {
  const nameOfObject = startCase(props.log.logType.replace(/:.+$/g, ""));
  const scope = useCss(css);

  return (
    <Modal
      close={props.close}
      headerText={`This ${nameOfObject} has been updated`}
      primaryAction={props.viewUpdatedVersion}
      primaryText={`View updated ${nameOfObject}`}
      secondaryAction={props.close}
      secondaryText="Done"
    >
      <div {...scope}>
        <div className="caption">
          You can still view this outdated {nameOfObject}, but cannot modify it.
          To see the update that was made to it, click the "View updated{" "}
          {nameOfObject}" button.
        </div>
        <div className="the-old-log">
          <div>Title:</div>
          <div className="caption">{props.log.title}</div>
          <div className="description">Description:</div>
          <div
            dangerouslySetInnerHTML={{ __html: props.log.description }}
            className="caption"
          />
        </div>
      </div>
    </Modal>
  );
}

const css = `
& .the-old-log {
  margin: 1.6rem 0;
}

& .description {
  margin-top: 1.6rem;
}
`;

type ViewOutdatedLogProps = {
  log: ClientLog;
  close(): any;
  viewUpdatedVersion(): any;
};
