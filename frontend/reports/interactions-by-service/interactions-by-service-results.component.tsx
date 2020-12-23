import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage, formatDuration } from "../shared/report.helpers";
import CollapsibleTableRows, {
  ToggleCollapseButton,
  ToggleAllButton,
} from "../shared/collapsible-table-rows.component";
import dayjs from "dayjs";
import { values } from "lodash-es";

export default function InteractionsByService(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/interactions-by-service`
  );

  if (isLoading || error) {
    return <div>"Loading..."</div>;
  }

  const groupedServices = data.programs.reduce((acc, program) => {
    acc[program.programId] = {};
    return acc;
  }, {});

  data.services.forEach((service) => {
    groupedServices[service.programId][service.serviceId] = service;
  });

  data.followUpServicesTotal.forEach((followUpService) => {
    groupedServices[followUpService.programId][
      followUpService.serviceId
    ].numFollowUps = followUpService.numFollowUps;
    groupedServices[followUpService.programId][
      followUpService.serviceId
    ].totalFollowUpDuration = followUpService.totalDuration;
  });

  const renderProgramRows = (program) => {
    const followUpProgram = data.followUpProgramTotals.find(
      (followUpProgram) => program.programId === followUpProgram.programId
    );

    return (
      <CollapsibleTableRows
        key={program.programId}
        everpresentRow={
          <tr>
            <th>{program.programName}</th>
            <td>
              <ToggleCollapseButton />
            </td>
            <td>{program.numClients.toLocaleString()}</td>
            <td>{program.numInteractions.toLocaleString()}</td>
            <td>{formatDuration(program.totalDuration)}</td>
            <td>{followUpProgram.numFollowUps.toLocaleString()}</td>
            <td>{formatDuration(followUpProgram.totalDuration)}</td>
          </tr>
        }
        collapsibleRows={values(groupedServices[program.programId]).map(
          (service) => (
            <tr key={service.serviceId}>
              <td>{"\u2014"}</td>
              <th>{service.serviceName}</th>
              <td>{service.numClients.toLocaleString()}</td>
              <td>{service.numInteractions.toLocaleString()}</td>
              <td>{formatDuration(service.totalDuration)}</td>
              <td>{service.numFollowUps.toLocaleString()}</td>
              <td>{formatDuration(service.totalFollowUpDuration)}</td>
            </tr>
          )
        )}
      />
    );
  };

  return (
    <>
      <BasicTableReport
        title="Interactions By Program and Service"
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
        tableStyle={{ width: "100%" }}
        headerRows={
          <tr>
            <th>Program</th>
            <th style={{ width: "20%" }}>Service</th>
            <th>Client Count</th>
            <th>Interaction Count</th>
            <th>Interaction Hours</th>
            <th>Follow-up Count</th>
            <th>Follow-up Hours</th>
          </tr>
        }
        contentRows={data.programs.map(renderProgramRows)}
        footerRows={
          <tr>
            <th>All programs</th>
            <td>
              <ToggleAllButton />
            </td>
            <td>{data.grandTotal.numClients.toLocaleString()}</td>
            <td>{data.grandTotal.numInteractions}</td>
            <td>{formatDuration(data.grandTotal.totalDuration)}</td>
            <td>{data.grandTotal.numFollowUps}</td>
            <td>{formatDuration(data.grandTotal.totalFollowUpDuration)}</td>
          </tr>
        }
      />
    </>
  );
}
