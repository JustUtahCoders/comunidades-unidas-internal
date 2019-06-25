import React, { useState, useEffect } from "react";
import PageHeader from "../page-header.component";
import { useCss } from "kremling";
import { navigate } from "@reach/router";
import easyFetch from "./easy-fetch";

export default function GithubIssueForm(props: CreateIssueProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState(getInitialDescription);
  const [createIssue, setCreateIssue] = useState(false);
  const [subject, setSubject] = useState("");
  const scope = useCss(css);

  useEffect(() => {
    if (createIssue) {
      easyFetch(`/api/github-issues`, {
        method: "POST",
        body: {
          name,
          email,
          title: subject,
          body: description
        }
      })
        .then(data => {
          navigate(`/report-issue/${data.issueNumber}`);
        })
        .catch(err => {
          console.error(err);
          setCreateIssue(false);
        });
    }
  }, [createIssue]);

  return (
    <>
      <PageHeader title={props.formTitle} />
      {showForm()}
    </>
  );

  function showForm() {
    return (
      <div className="card" {...scope}>
        <h4>
          This feature is still in development. In the meantime if you have a
          suggestion or would like to make a suggestion or share an insight,
          please let us know.
        </h4>
        <form onSubmit={handleSubmit} className="github-issue-form">
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
              <input
                type="text"
                name="subject"
                value={subject}
                onChange={evt => setSubject(evt.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <div>{props.purposeLabel}</div>
              <textarea
                name="issue-description"
                value={description}
                onChange={evt => setDescription(evt.target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit" className="primary" disabled={createIssue}>
              {props.buttonText}
            </button>
          </div>
        </form>
      </div>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setCreateIssue(true);
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
	& .github-issue-form > *:not(:first-child) {
		padding-top: 1.6rem;
	}

	& .github-issue-form textarea {
		width: 100%;
		height: 30rem;
	}
`;

type CreateIssueProps = {
  path: string;
  exact: boolean;
  formTitle: string;
  purposeLabel: string;
  formDescription: string;
  buttonText: string;
};
