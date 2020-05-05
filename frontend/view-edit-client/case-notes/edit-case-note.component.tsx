import React from "react";
import { LogTypeEditProps } from "../client-history/edit-log.component";
import FullRichTextEditorComponent from "../../rich-text/full-rich-text-editor.component";
import { useCss } from "kremling";
import easyFetch from "../../util/easy-fetch";
import { UserModeContext, UserMode } from "../../util/user-mode.context";

export default function EditCaseNote({
  log,
  actionsRef,
  clientId,
}: LogTypeEditProps) {
  const [title, setTitle] = React.useState(log.title);
  const fullEditorRef = React.useRef(null);
  const scope = useCss(css);
  const { userMode } = React.useContext(UserModeContext);

  React.useEffect(() => {
    actionsRef.current.save = (abortController) => {
      const query =
        userMode === UserMode.immigration ? `?tags=immigration` : "";
      return easyFetch(`/api/clients/${clientId}/logs/${log.id}${query}`, {
        method: "PATCH",
        signal: abortController.signal,
        body: {
          title,
          description: fullEditorRef.current.getHTML(),
        },
      });
    };

    actionsRef.current.delete = () => {
      return easyFetch(`/api/clients/${clientId}/logs/${log.id}`, {
        method: "DELETE",
      });
    };
  });

  return (
    <div {...scope}>
      <div className="case-note-title">
        <div>
          <label>Case note title</label>
        </div>
        <input
          type="text"
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          required
          id="case-note-title"
        />
      </div>
      <div>
        <div>
          <label>Case note description</label>
        </div>
        <FullRichTextEditorComponent
          ref={fullEditorRef}
          initialHTML={log.description}
          placeholder="Edit case note"
        />
      </div>
    </div>
  );
}

const css = `
& .case-note-title {
  margin-bottom: 2.4rem;
}
`;
