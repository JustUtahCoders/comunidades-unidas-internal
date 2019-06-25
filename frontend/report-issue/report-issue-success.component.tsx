import React from "react";
import GithubIssueSuccess from "../util/github-issue-success.component";
import { navigate } from "@reach/router";
import easyFetch from "../util/easy-fetch";

export default function ReportIssueSuccess(props) {
  return (
    <>
      <GithubIssueSuccess successTitle="Report an issue" path="" />
    </>
  );
}
