import React from "react";
import GithubIssueForm from "../util/github-issue.component";

export default function MakeSuggestion(props) {
  return (
    <>
      <GithubIssueForm
        formTitle="Make a suggestion"
        formDescription="This feature is still in development. In the meantime if you have a suggestion or would like to make a suggestion or share an insight, please let us know."
        purposeLabel="Tell us more. The more detail we have the more we can help."
        buttonText="Submit Suggestion"
        path=""
        exact
      />
    </>
  );
}
