import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage } from "../shared/report.helpers";
import { sum, values } from "lodash-es";
import { CsvOptions } from "../../util/csv-utils";

export default function PovertyLineResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/poverty-lines`
  );

  if (isLoading) {
    return <div>"Loading..."</div>;
  }

  return (
    <BasicTableReport
      title={`Poverty Line ${data.reportParameters.povertyLineYear}`}
      getCsvOptions={getCsvOptions}
      headerRows={
        <tr>
          <th>Zip</th>
          <th>Clients below Poverty Line</th>
          <th>Total Clients</th>
          <th>Percentage</th>
        </tr>
      }
      contentRows={
        <>
          {Object.keys(data.results.clientsByZip).map((zip) => (
            <tr key={zip || "(Unknown)"}>
              <th>{zip || "(Unknown)"}</th>
              <td>
                {(
                  data.results.clientsBelowPovertyLine[zip] || 0
                ).toLocaleString()}
              </td>
              <td>{data.results.clientsByZip[zip].toLocaleString()}</td>
              <td>
                {formatPercentage(
                  data.results.clientsBelowPovertyLine[zip] || 0,
                  data.results.clientsByZip[zip]
                )}
              </td>
            </tr>
          ))}
          <tr>
            <th>All zips and clients</th>
            <td>
              {sum(
                values(data.results.clientsBelowPovertyLine)
              ).toLocaleString()}
            </td>
            <td>{data.results.totalClients.toLocaleString()}</td>
            <td>
              {formatPercentage(
                sum(values(data.results.clientsBelowPovertyLine)),
                data.results.totalClients
              )}
            </td>
          </tr>
        </>
      }
      footerRows={null}
      notes={[
        `All clients are counted in this report - even if their income is listed as 0`,
        `Poverty line formula: $${data.reportParameters.costFirstPerson.toLocaleString()} + (householdSize * $${data.reportParameters.costAdditionalPerson.toLocaleString()})`,
        <a target="_blank" href={data.reportParameters.povertyLineInfo}>
          More information about the Poverty Line
        </a>,
      ]}
    />
  );

  function getCsvOptions(): Promise<CsvOptions> {
    const allRow = {
      Zip: "All zips and clients",
      "Clients below Poverty Line": sum(
        values(data.results.clientsBelowPovertyLine)
      ).toLocaleString(),
      "Total Clients": data.results.totalClients.toLocaleString(),
      Percentage: formatPercentage(
        sum(values(data.results.clientsBelowPovertyLine)),
        data.results.totalClients
      ),
    };

    return Promise.resolve({
      columnNames: [
        "Zip",
        "Clients below Poverty Line",
        "Total Clients",
        "Percentage",
      ],
      data: Object.keys(data.results.clientsByZip)
        .map((zip) => ({
          Zip: zip,
          "Clients below Poverty Line": (
            data.results.clientsBelowPovertyLine[zip] || 0
          ).toLocaleString(),
          "Total Clients": data.results.clientsByZip[zip].toLocaleString(),
          Percentage: formatPercentage(
            data.results.clientsBelowPovertyLine[zip] || 0,
            data.results.clientsByZip[zip]
          ),
        }))
        .concat(allRow),
      fileName: "Poverty_Line.csv",
    });
  }
}
