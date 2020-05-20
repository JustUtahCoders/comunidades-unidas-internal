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
import Modal from "../util/modal.component";
import easyFetch from "../util/easy-fetch";
import { UserModeContext, UserMode } from "../util/user-mode.context";
import FilePreview from "./file-preview.component";
import dayjs from "dayjs";
import { getContentTypeQuery } from "./file-preview.component";

export default function ClientFileChip({
  file,
  refetchFiles,
  clientId,
}: ClientFileChipProps) {
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery = userMode === UserMode.immigration ? `tags=immigration` : "";

  React.useEffect(() => {
    if (isDeleting) {
      const abortController = new AbortController();

      easyFetch(`/api/clients/${clientId}/files/${file.id}?${tagsQuery}`, {
        method: "DELETE",
        signal: abortController.signal,
      })
        .then(refetchFiles)
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isDeleting, tagsQuery]);

  useDownloadUrl({
    clientId,
    file,
    isPerformingAction: isDownloading,
    setIsPerformingAction: setIsDownloading,
    tagsQuery,
    isAttachment: true,
    action(url) {
      window.location.href = url;
    },
  });

  useDownloadUrl({
    clientId,
    file,
    isPerformingAction: isPrinting,
    setIsPerformingAction: setIsPrinting,
    tagsQuery,
    isAttachment: false,
    action(url) {
      const win = window.open(url, "_blank");
      win.focus();
    },
  });

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
        <Modal
          close={close}
          headerText={
            (file.redacted ? "Immigration file" : file.fileName) +
            ` - ${file.createdBy.fullName} - ${dayjs(
              file.createdBy.timestamp
            ).format("MM/DD/YYYY")}`
          }
          primaryText="Download"
          primaryAction={download}
          secondaryText="Print"
          secondaryAction={printFile}
          tertiaryText="Delete"
          tertiaryAction={deleteFile}
          wide
        >
          <FilePreview file={file} clientId={clientId} />
        </Modal>
      )}
    </>
  );

  function close() {
    setIsPreviewing(false);
  }

  function download() {
    setIsDownloading(true);
  }

  function deleteFile() {
    close();
    setIsDeleting(true);
  }

  function printFile() {
    close();
    setIsPrinting(true);
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

function useDownloadUrl({
  isPerformingAction,
  clientId,
  file,
  tagsQuery,
  setIsPerformingAction,
  action,
  isAttachment,
}) {
  React.useEffect(() => {
    if (isPerformingAction) {
      const abortController = new AbortController();

      const contentDisposition = isAttachment
        ? `contentDisposition=${encodeURIComponent(
            `attachment; filename="${file.fileName}"`
          )}&`
        : "";
      const contentType = isAttachment
        ? ""
        : getContentTypeQuery(file.fileName);

      easyFetch(
        `/api/clients/${clientId}/files/${file.id}/signed-downloads?${contentType}${contentDisposition}${tagsQuery}`,
        {
          signal: abortController.signal,
        }
      )
        .then((response) => {
          action(response.downloadUrl);
        })
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setIsPerformingAction(false);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isPerformingAction, tagsQuery, file.fileName, clientId]);
}
