import React from "react";
import { useCss } from "kremling";
import PageHeader from "../../page-header.component";
import SingleClientSearchInput from "../../client-search/single-client/single-client-search-input.component";
import FullRichTextEditor from "../../rich-text/full-rich-text-editor.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import { navigate } from "@reach/router";

export default function AddCaseNote({
  isGlobalAdd,
  clientId
}: AddCaseNoteProps) {
  const scope = useCss(css);
  const [title, setTitle] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const fullEditorRef = React.useRef(null);
  const formRef = React.useRef(null);

  React.useEffect(() => {
    formRef.current.querySelector("input").focus();
  });

  React.useEffect(() => {
    if (creating) {
      const abortController = new AbortController();

      easyFetch(`/clients/${clientId}/logs`, {
        method: "POST",
        signal: abortController.signal,
        body: {
          logType: "caseNote",
          title,
          description: fullEditorRef.current.getHTML()
        }
      })
        .then(data => {
          showGrowl({ type: GrowlType.success, message: "Created case note" });
          navigate(`/clients/${clientId}/history`);
        })
        .catch(err => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setCreating(false);
        });

      return () => abortController.abort();
    }
  }, [creating, clientId]);

  return (
    <>
      {isGlobalAdd && <PageHeader title="Add a case note" />}
      <form
        className="card add-case-note"
        onSubmit={handleSubmit}
        ref={formRef}
        {...scope}
      >
        {!isGlobalAdd && <h3>Add a case note</h3>}
        {isGlobalAdd && <SingleClientSearchInput autoFocus />}
        <div>
          <div>
            <label id="case-note-title">Case note title</label>
          </div>
          <input
            type="text"
            value={title}
            onChange={evt => setTitle(evt.target.value)}
            id="case-note-title"
          />
        </div>
        <div>
          <div>
            <label>Case note description</label>
          </div>
          <FullRichTextEditor ref={fullEditorRef} />
        </div>
        <div>
          <a className="secondary button" href="javascript:history.back()">
            Cancel
          </a>
          <button type="submit" className="primary">
            Create case note
          </button>
        </div>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    setCreating(true);
  }
}

const css = `
& .add-case-note > *:not(:first-child) {
  margin-top: 2.4rem;
}

& h3 {
  margin-top: 0;
}
`;

type AddCaseNoteProps = {
  isGlobalAdd?: boolean;
  path?: string;
  clientId?: string;
};
