import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import CollapsibleTableRows, {
  ToggleCollapseButton,
} from "../shared/collapsible-table-rows.component";
import { sumBy } from "lodash-es";
import { CsvOptions } from "../../util/csv-utils";

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
        getCsvOptions={getCsvOptions}
        headerRows={
          <tr>
            <th>County</th>
            <th>Zip</th>
            <th>Client Count</th>
          </tr>
        }
        contentRows={
          <>
            {data &&
              Object.keys(data.zipsByCounty).map((county) => {
                const zips = data.zipsByCounty[county];
                console.log("%%%%%%%%%%%%%%%%%", zips);
                const countyTotal = sumBy(zips, "clientCount");
                console.log("**************", countyTotal);

                return (
                  <CollapsibleTableRows
                    key={county}
                    collapsibleRows={zips.map((zip) => (
                      <tr key={zip.zip}>
                        <td>{"\u2014"}</td>
                        <td>{zip.zip || "Unknown"}</td>
                        <td>{zip.clientCount}</td>
                      </tr>
                    ))}
                    everpresentRow={
                      <tr>
                        <td>{county}</td>
                        <td>
                          <ToggleCollapseButton />
                        </td>
                        <td>{countyTotal}</td>
                      </tr>
                    }
                  />
                );
              })}
          </>
        }
      />
    </>
  );

  function getCsvOptions(): Promise<CsvOptions> {
    // const allCountyRow = {
    //   "English Level": "Total",
    //   "Client Count": totalClients.toLocaleString(),
    //   Percentage: "100%",
    // };

    return Promise.resolve({
      columnNames: ["County", "Zip", "Client Count"],
      data: [],
      fileName: "Client_Zipcode.csv",
    });
  }
}
