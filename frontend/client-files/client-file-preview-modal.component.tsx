import React from "react";
import Modal from "../util/modal.component";
import FilePreview from "./file-preview.component";
import dayjs from "dayjs";
import { ClientFile } from "./client-files.component";
import easyFetch from "../util/easy-fetch";
import { UserModeContext, UserMode } from "../util/user-mode.context";
import { getContentTypeQuery } from "./file-preview.component";

export default function ClientFilePreviewModal(
  props: ClientFilePreviewModalProps
) {
  const { file, close, clientId, refetchFiles } = props;
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
        .then(close)
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
      console.log("printing");
      const win = window.open(url, "_blank");
      win.focus();
    },
  });

  const modalActions = file.redacted
    ? {
        primaryText: "Close",
        primaryAction: close,
      }
    : {
        primaryText: "Download",
        primaryAction: download,
        secondaryText: "Print",
        secondaryAction: printFile,
        tertiaryText: "Delete",
        tertiaryAction: deleteFile,
      };

  return (
    <Modal
      close={close}
      headerText={
        (file.redacted ? "Immigration file" : file.fileName) +
        ` - ${file.createdBy.fullName} - ${dayjs(
          file.createdBy.timestamp
        ).format("MM/DD/YYYY")}`
      }
      wide
      {...modalActions}
    >
      <FilePreview file={file} clientId={clientId} />
    </Modal>
  );

  function download() {
    setIsDownloading(true);
  }

  function deleteFile() {
    setIsDeleting(true);
  }

  function printFile() {
    setIsPrinting(true);
  }
}

type ClientFilePreviewModalProps = {
  file: ClientFile;
  clientId: string;
  close: () => void;
  refetchFiles: () => any;
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
