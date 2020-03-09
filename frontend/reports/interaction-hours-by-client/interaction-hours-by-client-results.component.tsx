import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { Link } from "@reach/router";

export default function InteractionHoursByClientResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/interaction-hours-by-client`
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred.</div>;
  }

  return (
    <>
      <BasicTableReport
        title="Client Interaction Hours"
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
                {dayjs(data.reportParameters.start).format("MMM D, YYYY")}
              </td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>{dayjs(data.reportParameters.end).format("MMM D, YYYY")}</td>
            </tr>
            <tr>
              <th>Min Interaction Hours</th>
              <td>{data.reportParameters.minInteractionSeconds / 3600}</td>
            </tr>
            <tr>
              <th>Max Interaction Hours</th>
              <td>{data.reportParameters.maxInteractionSeconds / 3600}</td>
            </tr>
          </>
        }
        footerRows={
          <tr>
            <th>Total Clients</th>
            <td>{data.pagination.numClients}</td>
          </tr>
        }
      />
      <BasicTableReport
        title="Clients"
        headerRows={
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th># of interactions</th>
            <th># of hours</th>
          </tr>
        }
        contentRows={
          <>
            {data.clients.map(client => (
              <tr key={client.id}>
                <td>
                  <Link to={`/clients/${client.id}`}>{client.id}</Link>
                </td>
                <td>
                  {client.firstName} {client.lastName}
                </td>
                <td>{client.numInteractions}</td>
                <td>{displayDuration(client.totalDuration)}</td>
              </tr>
            ))}
          </>
        }
      />
    </>
  );

  function displayDuration(duration) {
    const [hours, mins, seconds] = duration.split(":");
    return `${Number(hours)} hrs, ${mins} mins`;
  }
}
