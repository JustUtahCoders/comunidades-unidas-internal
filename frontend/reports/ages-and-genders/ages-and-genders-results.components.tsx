import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { uniq } from "lodash-es";
import { capitalize } from "../shared/report.helpers";
import CollapsibleTableRows, {
  ToggleCollapseButton,
} from "../shared/collapsible-table-rows.component";

export default function AgesAndGendersResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/ages-and-genders`
  );

  if (isLoading || error) {
    return <div>Loading...</div>;
  }

  const uniqueGenders = uniq(Object.keys(data.totals.genders));

  const ageGroups = [
    "0-17",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
  ];

  return (
    <BasicTableReport
      title="Ages and Genders"
      headerRows={
        <tr>
          <th>Client/Lead</th>
          <th style={{ width: "15%" }}>Gender</th>
          <th>Total</th>
          {ageGroups.map((ageGroup) => (
            <th key={ageGroup}>{ageGroup}</th>
          ))}
        </tr>
      }
      contentRows={
        <>
          <CollapsibleTableRows
            everpresentRow={
              <tr>
                <th>Client</th>
                <th>
                  <ToggleCollapseButton />
                </th>
                <td>{data.totals.numClients.toLocaleString()}</td>
                {ageGroups.map((ageGroup) => (
                  <td key={ageGroup}>
                    {data.clients.allGenders[ageGroup].toLocaleString()}
                  </td>
                ))}
              </tr>
            }
            collapsibleRows={uniqueGenders.map((gender) => (
              <tr key={gender}>
                <th>{"\u2014"}</th>
                <th>{capitalize(gender)}</th>
                <td>{data.clients.allAges[gender].toLocaleString()}</td>
                {ageGroups.map((ageGroup) => (
                  <td key={ageGroup}>
                    {data.clients[ageGroup][gender].toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          />
          <CollapsibleTableRows
            everpresentRow={
              <tr>
                <th>Lead</th>
                <th>
                  <ToggleCollapseButton />
                </th>
                <td>{data.totals.numLeads.toLocaleString()}</td>
                {ageGroups.map((ageGroup) => (
                  <td key={ageGroup}>
                    {data.leads.allGenders[ageGroup].toLocaleString()}
                  </td>
                ))}
              </tr>
            }
            collapsibleRows={uniqueGenders.map((gender) => (
              <tr>
                <th>{"\u2014"}</th>
                <th>{capitalize(gender)}</th>
                <td>{data.leads.allAges[gender].toLocaleString()}</td>
                {ageGroups.map((ageGroup) => (
                  <td key={ageGroup}>
                    {data.leads[ageGroup][gender].toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          />
        </>
      }
      footerRows={
        <CollapsibleTableRows
          everpresentRow={
            <tr>
              <th>All</th>
              <th>
                <ToggleCollapseButton />
              </th>
              <td>
                {(
                  data.totals.numLeads + data.totals.numClients
                ).toLocaleString()}
              </td>
              {ageGroups.map((ageGroup) => (
                <td key={ageGroup}>
                  {data.totals.ages[ageGroup].toLocaleString()}
                </td>
              ))}
            </tr>
          }
          collapsibleRows={uniqueGenders.map((gender) => (
            <tr>
              <th>{"\u2014"}</th>
              <th>{capitalize(gender)}</th>
              <td>{data.totals.genders[gender].toLocaleString()}</td>
              {ageGroups.map((ageGroup) => (
                <td key={ageGroup}>
                  {(
                    data.clients[ageGroup][gender] +
                    data.leads[ageGroup][gender]
                  ).toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        />
      }
      notes={[
        `The All category will report a double count for a person who started as a Lead and then later became a Client. (Inquire if you want to change this).`,
      ]}
    />
  );
}
