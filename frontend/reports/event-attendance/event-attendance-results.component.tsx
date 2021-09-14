import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";

export default function EventAttendanceResults(props) {
  const { isLoading, data, error } = useReportsApi(`/api/reports/events`);

  if (!data) {
    return <div>Loading</div>;
  }

  if (error) {
    throw error;
  }

  return (
    <>
      <BasicTableReport
        title="Event Attendance"
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
          </>
        }
        footerRows={
          <>
            <tr>
              <td>Number of Events</td>
              <td>{data.numEvents}</td>
            </tr>
            <tr>
              <td>Total Attendance</td>
              <td>{data.totalAttendance.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Materials Distributed</td>
              <td>{data.materialsDistributed.toLocaleString()}</td>
            </tr>
          </>
        }
      />
    </>
  );
}
