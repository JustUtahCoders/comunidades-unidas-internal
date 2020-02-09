import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage } from "../shared/report.helpers";

export default function PovertyLineResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/poverty-lines`
  );

  return (
    <BasicTableReport
      title={`Poverty Line ${
        data ? data.reportParameters.povertyLineYear : ""
      }`}
      headerRows={
        <tr>
          <th>Statistic</th>
          <th>Client count</th>
          <th>Percentage</th>
        </tr>
      }
      contentRows={
        <>
          <tr>
            <th>All clients</th>
            <td>{data && data.results.totalClients}</td>
            <td>100%</td>
          </tr>
          <tr>
            <th>Below $200 annual income</th>
            <td>{data && data.results.clientsBelow200DollarsAnnually}</td>
            <td>
              {data &&
                formatPercentage(
                  data.results.clientsBelow200DollarsAnnually,
                  data.results.totalClients
                )}
            </td>
          </tr>
        </>
      }
      footerRows={
        <>
          <tr>
            <th>Below poverty line</th>
            <td>{data && data.results.clientsBelowPovertyLine}</td>
            <td>
              {data &&
                formatPercentage(
                  data.results.clientsBelowPovertyLine,
                  data.results.totalClients
                )}
            </td>
          </tr>
        </>
      }
      notes={[
        `The below $200 annually column is included in the poverty line total.`
      ]}
    />
  );
}
