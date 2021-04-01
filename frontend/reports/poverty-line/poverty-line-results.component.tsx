import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage } from "../shared/report.helpers";
import { sum, values } from "lodash-es";

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
        </>
      }
      footerRows={
        <tr>
          <th>All zips and clients</th>
          <td>
            {sum(values(data.results.clientsBelowPovertyLine)).toLocaleString()}
          </td>
          <td>{data.results.totalClients.toLocaleString()}</td>
          <td>
            {formatPercentage(
              sum(values(data.results.clientsBelowPovertyLine)),
              data.results.totalClients
            )}
          </td>
        </tr>
      }
      notes={[
        `All clients are counted in this report - even if their income is listed as 0`,
        `Poverty line formula: $${data.reportParameters.costFirstPerson.toLocaleString()} + (householdSize * $${data.reportParameters.costAdditionalPerson.toLocaleString()})`,
        <a target="_blank" href={data.reportParameters.povertyLineInfo}>
          More information about the Poverty Line
        </a>,
      ]}
    />
  );
}
