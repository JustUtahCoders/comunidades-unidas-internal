import React from "react";
import { ClientFile } from "./client-files.component";

export default function FilePreview({
  file,
  downloadUrl,
  needsDownloadUrl,
}: FilePreviewProps) {
  React.useEffect(() => {
    switch (file.fileExtension) {
      case "pdf":
        needsDownloadUrl();
      default:
        break;
    }
  }, [file.fileExtension, needsDownloadUrl]);

  if (file.redacted) {
    return <div>Redacted</div>;
  } else {
    switch (file.fileExtension) {
      case "pdf":
        return (
          <embed
            src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${downloadUrl}`}
          />
        );
      default:
        return <div>No preview available</div>;
    }
  }
}

export type FilePreviewProps = {
  file: ClientFile;
  downloadUrl: string;
  needsDownloadUrl(): void;
};
