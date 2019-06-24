import React, { useState, useEffect } from "react";
import PageHeader from "../page-header.component";
import { useCss } from "kremling";
import { navigate } from "@reach/router";
import easyFetch from "../util/easy-fetch";

export default function MakeSuggestion(props: MakeSuggestionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [makeSuggestion, setMakeSuggestion] = useState(false);
  const [subject, setSubject] = useState("");
  const scope = useCss(css);

  useEffect(() => {
    if (makeSuggestion) {
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
          setMakeSuggestion(false);
        });
    }
  }, [makeSuggestion]);

  return (
    <>
      <PageHeader title="Make a suggestion" />
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
        <form onSubmit={handleSubmit} className="make-suggestion-form">
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
                Tell us more. The more detail we have the more we can help.
              </div>
              <textarea
                name="issue-description"
                value={description}
                onChange={evt => setDescription(evt.target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit" className="primary" disabled={makeSuggestion}>
              Submit an issue
            </button>
          </div>
        </form>
      </div>
    );
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setMakeSuggestion(true);
  }
}

const css = `
& .make-suggestion-form > *:not(:first-child) {
  padding-top: 1.6rem;
}

& .make-suggestion-form textarea {
  width: 100%;
  height: 30rem;
}
`;

type MakeSuggestionProps = {
  path: string;
  exact: boolean;
};
