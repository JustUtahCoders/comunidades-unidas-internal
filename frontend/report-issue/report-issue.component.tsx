import React, { useState, useEffect } from "react";
import PageHeader from "../page-header.component";
import { useCss } from "kremling";
import { navigate } from "@reach/router";
import easyFetch from "../util/easy-fetch";

export default function ReportIssue({
  title = "Report an issue",
  missingFeature,
  hideHeader,
}: ReportIssueProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState(getInitialDescription);
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [subject, setSubject] = useState("");
  const scope = useCss(css);

  useEffect(() => {
    if (creatingIssue) {
      easyFetch(`/api/github-issues`, {
        method: "POST",
        body: {
          name,
          email,
          title: subject,
          body: description,
        },
      })
        .then((data) => {
          navigate(`/report-issue/${data.issueNumber}`);
        })
        .catch((err) => {
          console.error(err);
          setCreatingIssue(false);
        });
    }
  }, [creatingIssue]);

  return (
    <>
      {!hideHeader && <PageHeader title={title} />}
      {showForm()}
    </>
  );

  function showForm() {
    return (
      <div className="card" {...scope}>
        <h4>{subheaderText()}</h4>
        <form onSubmit={handleSubmit} className="report-issue-form">
          <div>
            <label>
              <div>Name</div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(evt) => setName(evt.target.value)}
                required
                autoFocus
              />
            </label>
          </div>
          <div>
            <label>
              <div>Email address</div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <div>Subject</div>
            </label>
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={(evt) => setSubject(evt.target.value)}
              required
            />
          </div>
          <div>
            <label>
              <div>{textAreaDescription()}</div>
              <textarea
                name="issue-description"
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit" className="primary" disabled={creatingIssue}>
              {submitText()}
            </button>
          </div>
        </form>
      </div>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setCreatingIssue(true);
  }

  function subheaderText() {
    if (missingFeature) {
      return "This feature is still in development. In the meantime if you would like to make a suggestion or share an insight, please let us know.";
    } else {
      return "Have an issue, idea, or question about this website? Submit it here and we'll get back to you.";
    }
  }

  function textAreaDescription() {
    if (missingFeature) {
      return `Tell us more. The more detail we have the more we can help.`;
    } else {
      return `What problem are you experiencing or what idea do you have?`;
    }
  }

  function submitText() {
    if (missingFeature) {
      return `Submit suggestion`;
    } else {
      return `Submit an issue`;
    }
  }
}

function getInitialDescription() {
  if (window.history.state && window.history.state.prepopulatedDescription) {
    return `Information about error: \n\n${JSON.stringify(
      window.history.state.prepopulatedDescription,
      null,
      4
    )}`;
  } else {
    return "";
  }
}

const css = `
& .report-issue-form > *:not(:first-child) {
  padding-top: 1.6rem;
}

& .report-issue-form textarea {
  width: 100%;
  height: 30rem;
}
`;

type ReportIssueProps = {
  path?: string;
  title?: string;
  missingFeature?: boolean;
  hideHeader?: boolean;
};
