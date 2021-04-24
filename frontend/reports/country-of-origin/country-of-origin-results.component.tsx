import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { formatPercentage } from "../shared/report.helpers";
import { sum, values, entries } from "lodash-es";
import { countryCodeToName } from "../../util/country-select.component";

export default function CountriesOfOriginResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/countries-of-origin`
  );

  if (!data) {
    return <div>Loading</div>;
  }

  if (error) {
    throw error;
  }

  const totalClients = sum(values(data.countriesOfOrigin));
  const unknownClients = data.countriesOfOrigin.Unknown || 0;
  const totalKnownOriginClients = totalClients - unknownClients;

  const sortedCountries = entries<number>(data.countriesOfOrigin).sort(
    (first, second) => {
      return second[1] - first[1];
    }
  );

  return (
    <>
      <BasicTableReport
        title="Client Countries of Origin from Date of Intake Range"
        headerRows={null}
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
              <td>Known Countries</td>
              <td>{totalKnownOriginClients}</td>
            </tr>
            <tr>
              <td>Unknown Countries</td>
              <td>{unknownClients}</td>
            </tr>
          </>
        }
        footerRows={
          <tr>
            <td>Total clients</td>
            <td>{totalClients.toLocaleString()}</td>
          </tr>
        }
      />
      <BasicTableReport
        title="Country breakdown"
        headerRows={
          <tr>
            <th>Country</th>
            <th>Client count</th>
            <th>Percentage</th>
          </tr>
        }
        contentRows={
          <>
            {sortedCountries
              .filter((c) => c[0] !== "Unknown")
              .map((country) => (
                <tr key={country[0]}>
                  <th>{countryCodeToName[country[0]] || country[0]}</th>
                  <td>{country[1].toLocaleString()}</td>
                  <td>
                    {formatPercentage(country[1], totalKnownOriginClients)}
                  </td>
                </tr>
              ))}
          </>
        }
        footerRows={
          <>
            <tr>
              <th>Total</th>
              <td>{totalKnownOriginClients}</td>
              <td>100%</td>
            </tr>
          </>
        }
      />
    </>
  );
}
