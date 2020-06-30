import React from "react";
import easyFetch from "../util/easy-fetch";
import { UserModeContext, UserMode } from "../util/user-mode.context";
import ClientFilePreviewModal from "./client-file-preview-modal.component";
import { ClientFile } from "./client-files.component";

export default function ClientFilePreviewer({
  fileId,
  clientId,
  close,
}: ClientFilePreviewerProps) {
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";
  const [file, setFile] = React.useState<ClientFile>(null);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/clients/${clientId}/files/${fileId}${tagsQuery}`, {
      signal: ac.signal,
    })
      .then(setFile)
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      ac.abort();
    };
  }, [fileId]);

  return (
    file && (
      <ClientFilePreviewModal
        clientId={clientId}
        file={file}
        close={closeModal}
        refetchFiles={refetch}
      />
    )
  );

  function closeModal() {
    close(false);
  }

  function refetch() {
    close(true);
  }
}

type ClientFilePreviewerProps = {
  fileId: number;
  clientId: string;
  close: (refetch: boolean) => any;
};
