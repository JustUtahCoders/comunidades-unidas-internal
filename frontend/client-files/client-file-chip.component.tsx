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
import Chip from "../util/chips/chip.component";

export default function ClientFileChip({
  file,
  refetchFiles,
  clientId,
}: ClientFileChipProps) {
  return (
    <Chip
      topContent={
        <img
          src={extensionToImgUrl(file.fileExtension)}
          alt={`${file.fileExtension} icon`}
        />
      }
      bottomContent={<>{file.redacted ? "(immigration)" : file.fileName}</>}
      renderPreview={({ close }) => (
        <ClientFilePreviewModal
          file={file}
          close={close}
          clientId={clientId}
          refetchFiles={refetchFiles}
        />
      )}
    />
  );
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

type ClientFileChipProps = {
  file: ClientFile;
  clientId: string;
  refetchFiles(): void;
};
