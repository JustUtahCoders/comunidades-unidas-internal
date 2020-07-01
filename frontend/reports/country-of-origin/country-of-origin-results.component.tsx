import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage, capitalize } from "../shared/report.helpers";
import { sum, values, entries } from "lodash-es";
import { countryCodeToName } from "../../util/country-select.component";

export default function CountriesOfOriginResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/countries-of-origin`
  );

  if (!data) {
    return <div>Loading</div>;
  }

  const totalClients = sum(values(data.countriesOfOrigin));
  const unknownClients = data.countriesOfOrigin.Unknown;
  const totalKnownOriginClients = totalClients - unknownClients;

  const sortedCountries = entries<number>(data.countriesOfOrigin).sort(
    (first, second) => {
      return second[1] - first[1];
    }
  );

  return (
    <>
      <BasicTableReport
        title="Client Countries of Origin"
        headerRows={null}
        contentRows={
          <>
            <tr>
              <td>Known</td>
              <td>{totalKnownOriginClients}</td>
            </tr>
            <tr>
              <td>Unknown</td>
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
