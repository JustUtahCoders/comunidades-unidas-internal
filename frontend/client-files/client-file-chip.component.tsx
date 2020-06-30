import React from "react";
import { ClientFile } from "./client-files.component";
import { useCss } from "kremling";
import svgUrl from "../../icons/1126854-file-types/svg/001-file.svg";
import pngUrl from "../../icons/1126854-file-types/svg/003-file-2.svg";
import jpgUrl from "../../icons/1126854-file-types/svg/004-file-3.svg";
import wordUrl from "../../icons/1126854-file-types/svg/005-file-4.svg";
import pdfUrl from "../../icons/1126854-file-types/svg/008-file-7.svg";
import zipUrl from "../../icons/1126854-file-types/svg/009-file-8.svg";
import excelUrl from "../../icons/1126854-file-types/svg/047-file-46.svg";
import gifUrl from "../../icons/1126854-file-types/svg/025-file-24.svg";
import unknownUrl from "../../icons/1126854-file-types/svg/046-file-45.svg";
import ClientFilePreviewModal from "./client-file-preview-modal.component";

export default function ClientFileChip({
  file,
  refetchFiles,
  clientId,
}: ClientFileChipProps) {
  const [isPreviewing, setIsPreviewing] = React.useState(false);

  return (
    <>
      <div
        {...useCss(css)}
        className="client-file-chip"
        role="button"
        tabIndex={0}
        onClick={() => setIsPreviewing(true)}
      >
        <div className="file-type-img">
          <img
            src={extensionToImgUrl(file.fileExtension)}
            alt={`${file.fileExtension} icon`}
          />
        </div>
        <div className="file-description">
          {file.redacted ? "(immigration)" : file.fileName}
        </div>
      </div>
      {isPreviewing && (
        <ClientFilePreviewModal
          file={file}
          close={close}
          clientId={clientId}
          refetchFiles={refetchFiles}
        />
      )}
    </>
  );

  function close() {
    setIsPreviewing(false);
  }
}

function extensionToImgUrl(extension) {
  switch (extension) {
    case "svg":
      return svgUrl;
    case "png":
      return pngUrl;
    case "jpg":
    case "jpeg":
      return jpgUrl;
    case "doc":
    case "docx":
      return wordUrl;
    case "pdf":
      return pdfUrl;
    case "zip":
      return zipUrl;
    case "xls":
    case "xlsx":
      return excelUrl;
    case "gif":
      return gifUrl;
    default:
      return unknownUrl;
  }
}

const css = `
& .client-file-chip {
  min-width: 15rem;
  width: 15rem;
  height: 15rem;
  border: .1rem solid var(--medium-gray);
  margin: 0 1.6rem 3.2rem 1.6rem;
  border-radius: .4rem;
  cursor: pointer;
}

& .file-type-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
  padding: .8rem;
  background-color: var(--very-light-gray);
}

& .file-type-img img {
  height: 6rem;
}

& .file-description {
  border-top: .1rem solid var(--medium-gray);
  height: 6.8rem;
  padding: 0 .8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.4rem;
  word-break: break-all;
}

& .client-file-chip:hover .file-description {
  background-color: var(--light-gray);
}
`;

type ClientFileChipProps = {
  file: ClientFile;
  clientId: string;
  refetchFiles(): void;
};
