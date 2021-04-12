export function exportToCsv(options: CsvOptions) {
  let dataUrl = `data:text/csv;charset=utf-8,`;
  dataUrl += options.columnNames.join(",");
  options.data.forEach((row) => {
    dataUrl +=
      "\n" +
      options.columnNames
        .map((c) =>
          typeof row[c] === "string" ? row[c].replace(/#/g, "No.") : row[c]
        )
        .join(",");
  });

  const link = document.createElement("a");
  link.href = encodeURI(dataUrl);
  link.download = options.fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface CsvOptions {
  data: any[];
  columnNames: string[];
  fileName: string;
}
