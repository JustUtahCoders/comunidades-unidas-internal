import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { uniq } from "lodash-es";
import { capitalize } from "../shared/report.helpers";

export default function ClientZipcodeResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/client-zipcode`
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
          </>
        }
      />
      <BasicTableReport
        title={`Clients by Zipcode`}
        headerRows={
          <tr>
            <th>Zipcode</th>
            <th>City</th>
            <th>Client Count</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <td>{data.results.clientZipcode}</td>
              <td>{data.results.clientCity}</td>
              <td>{data.results.clientCount}</td>
            </tr>
          </>
        }
      />
    </>
  );
}
