import React from "react";
import { RichTextContainer, RichTextEditor } from "bandicoot";
import Bold from "./control-buttons/bold.component";
import { useCss } from "kremling";
import Italic from "./control-buttons/italic.component";
import Underline from "./control-buttons/underline.component";
import BulletedList from "./control-buttons/bulleted-list.component";
import NumberedList from "./control-buttons/numbered-list.component";
import Indent from "./control-buttons/indent.component";
import Outdent from "./control-buttons/outdent.component";
import RichTextLink from "./control-buttons/rich-text-link.component";
import RichTextImage from "./control-buttons/rich-text-image.component";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);

export default React.forwardRef(function FullRichTextEditor(
  props: FullRichTextEditorProps,
  externalRef
) {
  const scope = useCss(css);
  const richTextEditorRef = React.useRef(null);

  React.useEffect(() => {
    if (externalRef) {
      // @ts-ignore
      externalRef.current = {
        getHTML: richTextEditorRef.current.getHTML
      };
    }
  }, [externalRef]);

  return (
    <div className="editor-container" {...scope}>
      <RichTextContainer>
        <div className="control-buttons">
          <Bold />
          <Italic />
          <Underline />
          <BulletedList />
          <NumberedList />
          <Indent />
          <Outdent />
          <RichTextLink richTextEditorRef={richTextEditorRef} />
          <RichTextImage />
        </div>
        <RichTextEditor
          placeholder={props.placeholder}
          initialHTML={props.initialHTML}
          ref={richTextEditorRef}
          className="editor"
          sanitizeHTML={DOMPurify.sanitize}
        />
      </RichTextContainer>
    </div>
  );
});

const css = `
& .editor-container {
  position: relative;
}

& .control-buttons {
  display: flex;
}

& .editor {
  padding: 1.6rem;
  border: 1px solid var(--medium-gray);
  border-radius: .4rem;
  min-height: 10rem;
  background-color: white;
}
`;

type FullRichTextEditorProps = {
  placeholder: string;
  initialHTML?: string;
};
