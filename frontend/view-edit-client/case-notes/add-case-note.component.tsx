import React from "react";
import { useCss } from "kremling";
import PageHeader from "../../page-header.component";
import SingleClientSearchInput from "../../client-search/single-client/single-client-search-input.component";
import FullRichTextEditor from "../../rich-text/full-rich-text-editor.component";
import easyFetch from "../../util/easy-fetch";
import { showGrowl, GrowlType } from "../../growls/growls.component";
import { navigate } from "@reach/router";
import { UserModeContext, UserMode } from "../../util/user-mode.context";

export default function AddCaseNote({
  isGlobalAdd,
  clientId: clientIdFromProps,
}: AddCaseNoteProps) {
  const scope = useCss(css);
  const [title, setTitle] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const fullEditorRef = React.useRef(null);
  const formRef = React.useRef(null);
  const caseNoteTitleRef = React.useRef(null);
  const singleClientSearchInputRef = React.useRef(null);
  const clientIdForNote = singleClientSearchInputRef.current
    ? singleClientSearchInputRef.current.clientId
    : clientIdFromProps;
  const { userMode } = React.useContext(UserModeContext);

  React.useEffect(() => {
    if (!isGlobalAdd) {
      caseNoteTitleRef.current.focus();
    }
  }, [caseNoteTitleRef.current]);

  React.useEffect(() => {
    if (creating) {
      const abortController = new AbortController();

      const query =
        userMode === UserMode.immigration ? `?tags=immigration` : "";
      easyFetch(`/api/clients/${clientIdForNote}/logs${query}`, {
        method: "POST",
        signal: abortController.signal,
        body: {
          logType: "caseNote",
          title,
          description: fullEditorRef.current.getHTML(),
        },
      })
        .then((data) => {
          showGrowl({ type: GrowlType.success, message: "Created case note" });
          navigate(`/clients/${clientIdForNote}/history`);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setCreating(false);
        });

      return () => abortController.abort();
    }
  }, [creating, clientIdForNote]);

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
        <p className="reminder">
          REMINDER: Casenotes are not intended for documenting client
          interactions. Please use the client interactions form for visits,
          phone call appointments, and community event interactions.
        </p>
        {isGlobalAdd && (
          <SingleClientSearchInput
            autoFocus
            nextThingToFocusRef={caseNoteTitleRef}
            ref={singleClientSearchInputRef}
          />
        )}
        <div>
          <div>
            <label id="case-note-title">Case note title</label>
          </div>
          <input
            type="text"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
            ref={caseNoteTitleRef}
            required
            id="case-note-title"
          />
        </div>
        <div>
          <div>
            <label>Case note description</label>
          </div>
          <FullRichTextEditor
            ref={fullEditorRef}
            placeholder="Case note description"
          />
        </div>
        <div>
          <a className="secondary button" onClick={() => window.history.back()}>
            Cancel
          </a>
          <button
            type="submit"
            className="primary"
            disabled={
              title.length > 0 &&
              fullEditorRef.current.getHTML().length > 0 &&
              clientIdForNote
            }
          >
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
