import React, { useState, useEffect } from "react";
import PageHeader from "../page-header.component";
import { useCss } from "kremling";
import { navigate } from "@reach/router";

export default function ReportIssue(props: ReportIssueProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [githubKey, setGithubKey] = useState(null);
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [subject, setSubject] = useState("");
  const scope = useCss(css);

  useEffect(() => {
    const abortController = new AbortController();
    fetch("/api/github-key", { signal: abortController.signal })
      .then(resp => resp.json())
      .then(data => setGithubKey(data["github-key"]));

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (githubKey) {
      fetch(
        "https://api.github.com/repos/JustUtahCoders/comunidades-unidas-internal/issues",
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${githubKey}`
          },
          body: JSON.stringify({
            title: subject,
            body: `From: ${name}, ${email}\n\n${description}`
          })
        }
      )
        .then(resp => resp.json())
        .then(data => {
          navigate(`/report-issue/${data.number}`);
        });
    }
  }, [creatingIssue]);

  return (
    <>
      <PageHeader title="Report an issue" />
      {showForm()}
    </>
  );

  function showForm() {
    return (
      <div className="card" {...scope}>
        <h4>
          Have an issue, idea, or question about this website? Submit it here
          and we'll get back to you.
        </h4>
        <form onSubmit={handleSubmit} className="report-issue-form">
          <div>
            <label>
              <div>Name</div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={evt => setName(evt.target.value)}
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
                onChange={evt => setEmail(evt.target.value)}
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
              onChange={evt => setSubject(evt.target.value)}
              required
            />
          </div>
          <div>
            <label>
              <div>
                What problem are you experiencing or what idea do you have?
              </div>
              <textarea
                name="issue-description"
                value={description}
                onChange={evt => setDescription(evt.target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit" className="primary" disabled={creatingIssue}>
              Submit an issue
            </button>
          </div>
        </form>
      </div>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (githubKey) {
      setCreatingIssue(true);
    }
  }
}

const css = `
& .report-issue-form > *:not(:first-child) {
  padding-top: 16rem;
}

& .report-issue-form textarea {
  width: 100%;
  height: 300rem;
}
`;

type ReportIssueProps = {
  path: string;
  exact: boolean;
};
