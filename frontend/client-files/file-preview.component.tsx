import React from "react";
import { ClientFile } from "./client-files.component";
import { UserMode, UserModeContext } from "../util/user-mode.context";
import { useCss } from "kremling";
import extName from "ext-name";

export default function FilePreview({ file, clientId }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(null);
  const [fetchingPreviewUrl, setFetchingPreviewUrl] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery = userMode === UserMode.immigration ? `tags=immigration` : "";

  React.useEffect(() => {
    if (!file.redacted) {
      switch (file.fileExtension) {
        case "pdf":
        case "png":
        case "jpg":
        case "jpeg":
        case "svg":
        case "gif":
          setFetchingPreviewUrl(true);
        default:
          break;
      }
    }
  }, [file.fileExtension, file.redacted]);

  React.useEffect(() => {
    if (fetchingPreviewUrl) {
      setPreviewUrl(
        `/api/file-download/${file.id}?${getContentTypeQuery(
          file.fileName
        )}${tagsQuery}`
      );
    }
  }, [fetchingPreviewUrl, file.fileExtension]);

  const maxHeight = window.innerHeight - (2 * window.innerHeight) / 10 - 140;

  return (
    <div className="preview" {...useCss(css)}>
      {getPreview()}
    </div>
  );

  function getPreview() {
    if (file.redacted) {
      return (
        <div className="empty">
          The contents of this file have been redacted.
        </div>
      );
    } else if (previewUrl) {
      switch (file.fileExtension) {
        case "pdf":
          return (
            <object
              data={previewUrl}
              type="application/pdf"
              width="100%"
              height={maxHeight + "px"}
            >
              <embed
                src={previewUrl}
                type="application/pdf"
                width="100%"
                height={maxHeight + "px"}
              />
            </object>
          );
        case "png":
        case "svg":
        case "jpg":
        case "jpeg":
        case "gif":
          return <img src={previewUrl} alt={file.fileName + " preview"} />;
        default:
          return <div className="empty">No preview available</div>;
      }
    } else {
      return <div className="empty">No preview available</div>;
    }
  }
}

export function getContentTypeQuery(fileName) {
  const mimeType = extName(fileName);
  if (mimeType && mimeType.length > 0) {
    return `contentType=${encodeURIComponent(mimeType[0].ext)}&`;
  } else {
    return "";
  }
}

export type FilePreviewProps = {
  file: ClientFile;
  clientId: string;
};

const css = `
& .preview {
  display: flex;
  justify-content: center;
}

& .empty {
  margin: 6.4rem 0;
}
`;
