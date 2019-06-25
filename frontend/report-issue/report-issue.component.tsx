import React from "react";
import GithubIssueForm from "../util/github-issue.component";

export default function ReportIssue(props) {
  return (
    <>
      <GithubIssueForm
        formTitle="Report an issue"
        formDescription="Have an issue, idea, or question about this website? Submit it here and we'll get back to you."
        purposeLabel="What problem are you experiencing or what idea do you have?"
        buttonText="Report Issue"
        path=""
        exact
      />
    </>
  );
}
