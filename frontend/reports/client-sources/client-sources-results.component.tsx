import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { formatPercentage, capitalize } from "../shared/report.helpers";
import { sum, values, entries } from "lodash-es";
import { clientSources } from "../../add-client/form-inputs/client-source-inputs.component";
import { CsvOptions } from "../../util/csv-utils";

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
    <>
      <BasicTableReport
        title="Client Date Of Intake Range"
        headerRows={
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <th>Start Date</th>
              <td>
                {data.reportParameters.start
                  ? dayjs(data.reportParameters.start).format("MMM D, YYYY")
                  : "\u2014"}
              </td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>
                {data.reportParameters.end
                  ? dayjs(data.reportParameters.end).format("MMM D, YYYY")
                  : "\u2014"}
              </td>
            </tr>
          </>
        }
        footerRows={
          <tr>
            <th>Total Clients</th>
            <td>{totalClients.toLocaleString()}</td>
          </tr>
        }
      />
      <BasicTableReport
        title="Client Sources"
        getCsvOptions={getCsvOptions}
        headerRows={
          <tr>
            <th>Source</th>
            <th>Client count</th>
            <th>Percentage</th>
          </tr>
        }
        contentRows={
          <>
            {sortedSources.map((source) => (
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
    </>
  );

  function getCsvOptions(): Promise<CsvOptions> {
    return Promise.resolve({
      columnNames: ["Source", "Client Count", "Percentage"],
      data: sortedSources.map((source) => ({
        Source: clientSources[source[0]] || source[0],
        "Client Count": source[1],
        Percentage: formatPercentage(source[1], totalClients),
      })),
      fileName: "Client_Sources.csv",
    });
  }
}
