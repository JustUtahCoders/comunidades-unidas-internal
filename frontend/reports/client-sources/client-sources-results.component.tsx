import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage, capitalize } from "../shared/report.helpers";
import { sum, values, entries } from "lodash-es";
import { clientSources } from "../../add-client/form-inputs/client-source-inputs.component";

export default function ClientSourcesResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/client-sources`
  );

  if (!data) {
    return <div>Loading</div>;
  }

  const totalClients = sum(values(data.clientSources));

  const sortedSources = entries<number>(data.clientSources).sort(
    (first, second) => {
      return second[1] - first[1];
    }
  );

  return (
    <BasicTableReport
      title="Client Sources"
      headerRows={
        <tr>
          <th>Source</th>
          <th>Client count</th>
          <th>Percentage</th>
        </tr>
      }
      contentRows={
        <>
          {sortedSources.map(source => (
            <tr key={source[0]}>
              <th>{clientSources[source[0]] || source[0]}</th>
              <td>{source[1].toLocaleString()}</td>
              <td>{formatPercentage(source[1], totalClients)}</td>
            </tr>
          ))}
        </>
      }
      footerRows={
        <>
          <tr>
            <th>Total</th>
            <td>{totalClients}</td>
            <td>100%</td>
          </tr>
        </>
      }
    />
  );
}
