import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { uniq } from "lodash-es";
import { capitalize } from "../shared/report.helpers";

export default function ClientZipcodeResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/client-zipcodes`
  );

  if (isLoading || error) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BasicTableReport
        title={"Clients by Zipcode"}
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
            <tr>
              <th>Total Clients</th>
              <td>{data.totalClients}</td>
            </tr>
            <tr>
              <th>Distinct Zip Codes</th>
              <td>{data.totalZipCodes}</td>
            </tr>
          </>
        }
      />
      <BasicTableReport
        headerRows={
          <tr>
            <th>Zipcode</th>
            <th>Client Count</th>
          </tr>
        }
        contentRows={
          <>
            {data &&
              data.results.map((result) => (
                <tr key={result.zip || "No Zip"}>
                  <td>{result.zip || "(No Zip)"}</td>
                  <td>{result.clientCount}</td>
                </tr>
              ))}
          </>
        }
      />
    </>
  );
}
