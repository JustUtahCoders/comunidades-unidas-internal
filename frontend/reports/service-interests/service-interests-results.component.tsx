import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import CollapsibleTableRows, {
  ToggleCollapseButton,
  ToggleAllButton
} from "../shared/collapsible-table-rows.component";

export default function ServiceInterestsResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/service-interests`
  );

  if (isLoading || error) {
    return <div>Loading...</div>;
  }

  const groupedServices = data.programs.reduce((acc, program) => {
    acc[program.programId] = [];
    return acc;
  }, {});

  data.services.forEach(service => {
    groupedServices[service.programId].push(service);
  });

  return (
    <BasicTableReport
      tableStyle={{ width: "100%" }}
      title={`Interactions by Program and Service`}
      headerRows={
        <tr>
          <th>Program</th>
          <th style={{ width: "20%" }}>Service</th>
          <th>Clients interested</th>
          <th>Leads interested</th>
        </tr>
      }
      contentRows={data.programs.map(program => (
        <CollapsibleTableRows
          key={program.programId}
          everpresentRow={
            <tr>
              <th>{program.programName}</th>
              <td>
                <ToggleCollapseButton />
              </td>
              <td>{program.clientsInterested.toLocaleString()}</td>
              <td>{program.leadsInterested.toLocaleString()}</td>
            </tr>
          }
          collapsibleRows={groupedServices[program.programId].map(service => (
            <tr key={service.id}>
              <td>{"\u2014"}</td>
              <th>{service.serviceName}</th>
              <td>{service.clientsInterested.toLocaleString()}</td>
              <td>{service.leadsInterested.toLocaleString()}</td>
            </tr>
          ))}
        />
      ))}
      footerRows={null}
    />
  );
}
