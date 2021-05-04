import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatDuration } from "../shared/report.helpers";
import CollapsibleTableRows, {
  ToggleCollapseButton,
  ToggleAllButton,
} from "../shared/collapsible-table-rows.component";
import dayjs from "dayjs";
import { sumBy, values } from "lodash-es";
import { CsvOptions } from "../../util/csv-utils";

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

  const renderUnspecifiedRow = () => {
    return (
      <CollapsibleTableRows
        key="unspecified"
        everpresentRow={
          <tr>
            <th>Unspecified</th>
            <td />
            <td />
            <td />
            <td />
            <td>
              {data.unspecifiedFollowUpTotals.numFollowUps.toLocaleString()}
            </td>
            <td>
              {formatDuration(data.unspecifiedFollowUpTotals.totalDuration)}
            </td>
          </tr>
        }
        collapsibleRows={[]}
      />
    );
  };

  return (
    <>
      <BasicTableReport
        title="Interactions By Program and Service"
        getCsvOptions={() => getCsvOptions(data)}
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
        contentRows={[
          ...data.programs.map(renderProgramRows),
          renderUnspecifiedRow(),
        ]}
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
            <td>{formatDuration(data.grandTotal.allFollowUpDuration)}</td>
          </tr>
        }
      />
    </>
  );

  function getCsvOptions(data): Promise<CsvOptions> {
    const allPrograms = {
      Program: "All programs",
      Service: "---",
      "Client Count": data.grandTotal.numClients.toLocaleString(),
      "Interaction Count": data.grandTotal.numInteractions,
      "Interaction Hours": `"${formatDuration(data.grandTotal.totalDuration)}"`,
      "Follow-up Count": data.grandTotal.numFollowUps,
      "Follow-up Hours": formatDuration(data.grandTotal.allFollowUpDuration),
    };

    const unspecified = {
      Program: "Unspecified",
      Service: "---",
      "Client Count": "---",
      "Interaction Count": "---",
      "Interaction Hours": "---",
      "Follow-up Count": data.unspecifiedFollowUpTotals.numFollowUps.toLocaleString(),
      "Follow-up Hours": formatDuration(
        data.unspecifiedFollowUpTotals.totalDuration
      ),
    };

    const interactionService = [];
    data.programs.map((program) => {
      const followUpProgram = data.followUpProgramTotals.find(
        (followUpProgram) => program.programId === followUpProgram.programId
      );

      interactionService.push({
        Program: `"${program.programName}"`,
        Service: "All",
        "Client Count": program.numClients.toLocaleString(),
        "Interaction Count": program.numInteractions.toLocaleString(),
        "Interaction Hours": `"${formatDuration(program.totalDuration)}"`,
        "Follow-up Count": followUpProgram.numFollowUps.toLocaleString(),
        "Follow-up Hours": formatDuration(followUpProgram.totalDuration),
      });

      values(groupedServices[program.programId]).map((service) => {
        interactionService.push({
          Program: `"${program.programName}"`,
          Service: service.serviceName,
          "Client Count": service.numClients.toLocaleString(),
          "Interaction Count": service.numInteractions.toLocaleString(),
          "Interaction Hours": `"${formatDuration(service.totalDuration)}"`,
          "Follow-up Count": service.numFollowUps.toLocaleString(),
          "Follow-up Hours": formatDuration(service.totalFollowUpDuration),
        });
      });
    });

    return Promise.resolve({
      columnNames: [
        "Program",
        "Service",
        "Client Count",
        "Interaction Count",
        "Interaction Hours",
        "Follow-up Count",
        "Follow-up Hours",
      ],
      data: [...interactionService, unspecified, allPrograms],

      fileName: "Interactoins_By_Service.csv",
    });
  }
}
