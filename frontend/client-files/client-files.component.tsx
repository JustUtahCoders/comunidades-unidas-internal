import React from "react";
import { SingleClient } from "../view-edit-client/view-client.component";
import { useCss, always } from "kremling";
import { useDropzone } from "react-dropzone";
import pictureUrl from "../../icons/148705-essential-collection/svg/picture.svg";
import easyFetch from "../util/easy-fetch";
import { UserModeContext, UserMode } from "../util/user-mode.context";
import ClientFileChip from "./client-file-chip.component";
import { v4 as uuidv4 } from "uuid";

export default function ClientFiles(props: ClientFilesProps) {
  const scope = useCss(css);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [filesToUpload, setFilesToUpload] = React.useState(null);
  const [clientFiles, setClientFiles] = React.useState<Array<ClientFile>>([]);
  const [refetchFiles, setRefetchFiles] = React.useState(false);
  const { userMode } = React.useContext(UserModeContext);
  const tagsQuery =
    userMode === UserMode.immigration ? `?tags=immigration` : "";

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/clients/${props.clientId}/files${tagsQuery}`, {
      signal: abortController.signal,
    })
      .then((data) => {
        setClientFiles(data.files);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      abortController.abort();
    };
  }, [props.clientId, tagsQuery, refetchFiles]);

  React.useEffect(() => {
    if (filesToUpload) {
      Promise.all(
        filesToUpload.map((file) => {
          const formData = new FormData();

          const s3Key = uuidv4();

          formData.append("file", file);
          formData.append("key", s3Key);

          const fileName = filesToUpload[0].name;
          const extensionSplit = fileName.split(".");
          const fileExtension =
            extensionSplit.length > 1
              ? extensionSplit[extensionSplit.length - 1]
              : "";
          const fileSize = filesToUpload[0].size;

          return easyFetch(`/api/file-upload`, {
            method: "POST",
            body: formData,
          }).then(() =>
            easyFetch(`/api/clients/${props.clientId}/files${tagsQuery}`, {
              method: "POST",
              body: {
                s3Key,
                fileName,
                fileExtension,
                fileSize,
              },
            })
          );
        })
      )
        .catch((err) => {
          setTimeout(() => {
            throw err;
          });
        })
        .finally(() => {
          setFilesToUpload(null);
          setRefetchFiles(!refetchFiles);
        });
    }
  }, [filesToUpload, tagsQuery, refetchFiles]);

  return (
    <div className="card" {...scope}>
      <h1>Client files</h1>
      <div
        {...getRootProps({
          className: always("dropzone").maybe("active", isDragActive),
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="active-drop">
            <img src={pictureUrl} />
            <div>Drop file</div>
          </div>
        ) : (
          "Drop files or click to add"
        )}
      </div>
      <div className="chips">
        {clientFiles.map((clientFile) => (
          <ClientFileChip
            key={clientFile.id}
            file={clientFile}
            clientId={props.clientId}
            refetchFiles={() => setRefetchFiles(!refetchFiles)}
          />
        ))}
      </div>
    </div>
  );

  function onDrop(acceptedFiles) {
    setFilesToUpload(acceptedFiles);
  }
}

const css = `
& h1 {
  font-size: 2.1rem;
}

& .dropzone {
  border: .1rem dashed var(--very-dark-gray);
  background-color: var(--colored-well);
  min-height: 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3.2rem;
}

& .dropzone img {
  height: 6rem;
}

& .active-drop {
  text-align: center;
}

& .chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
`;

type ClientFilesProps = {
  path: string;
  clientId: string;
  client: SingleClient;
  navigate?: (path) => any;
};

export type ClientFile = {
  id: number;
  fileName: string;
  fileSize: number;
  fileExtension: string;
  createdBy: {
    firstName: string;
    lastName: string;
    fullName: string;
    timestamp: string;
  };
  redacted: boolean;
};
