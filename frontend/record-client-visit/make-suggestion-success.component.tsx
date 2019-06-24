import React from "react";
import successIconUrl from "../../icons/148705-essential-collection/svg/success.svg";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";

export default function MakeSuggestionSuccess(
  props: MakeSuggestionSuccessProps
) {
  const scope = useCss(css);

  return (
    <>
      <PageHeader title="Make a suggestion" />
      <div className="card suggestion-success" {...scope}>
        <img src={successIconUrl} className="success-icon" />
        <div className="explanation">
          Thanks! We'll email you about this, and you can check for updates at
          any time at{" "}
          <a
            href={`https://github.com/JustUtahCoders/comunidades-unidas-internal/issues/${props.issueId}`}
            target="_blank"
          >
            Github Issue #{props.issueId}
          </a>
          .
        </div>
      </div>
    </>
  );
}

const css = `
& .suggestion-success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

& .success-icon {
  width: 8rem;
  height: 8rem;
  margin-bottom: 1.6rem;
}

& .explanation {
  max-width: 35rem;
}
`;

type MakeSuggestionSuccessProps = {
  issueId?: string;
  path: string;
};
