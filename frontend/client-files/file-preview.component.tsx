import React from "react";
import { ClientFile } from "./client-files.component";
import { UserMode, UserModeContext } from "../util/user-mode.context";
import easyFetch from "../util/easy-fetch";
import { useCss } from "kremling";
import extName from "ext-name";

export default function FilePreview({ file, clientId }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>(null);
  const [fetchingPreviewUrl, setFetchingPreviewUrl] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery = userMode === UserMode.immigration ? `tags=immigration` : "";

  React.useEffect(() => {
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
  }, [file.fileExtension]);

  React.useEffect(() => {
    if (fetchingPreviewUrl) {
      const abortController = new AbortController();

      easyFetch(
        `/api/clients/${clientId}/files/${
          file.id
        }/signed-downloads?${getContentTypeQuery(file.fileName)}${tagsQuery}`,
        {
          signal: abortController.signal,
        }
      )
        .then((response) => {
          setPreviewUrl(response.downloadUrl);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setFetchingPreviewUrl(false);
        });

      return () => {
        abortController.abort();
      };
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
      return <div className="empty">Redacted</div>;
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
  if (mimeType) {
    return `contentType=${encodeURIComponent(mimeType)}&`;
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
