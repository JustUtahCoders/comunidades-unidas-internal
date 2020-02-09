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

  const sortedCountries = entries<number>(data.countriesOfOrigin).sort(
    (first, second) => {
      return second[1] - first[1];
    }
  );

  return (
    <BasicTableReport
      title="Client Countries of Origin"
      headerRows={
        <tr>
          <th>Country</th>
          <th>Client count</th>
          <th>Percentage</th>
        </tr>
      }
      contentRows={
        <>
          {sortedCountries.map(country => (
            <tr key={country[0]}>
              <th>{countryCodeToName[country[0]] || country[0]}</th>
              <td>{country[1].toLocaleString()}</td>
              <td>{formatPercentage(country[1], totalClients)}</td>
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
