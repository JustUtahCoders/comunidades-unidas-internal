import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { Link } from "@reach/router";

export default function EventAttendanceResults(props) {
  const { data, error } = useReportsApi(`/api/reports/events`);
  const leadsData = useReportsApi(`/api/reports/leads-from-events`).data;

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
            <tr style={{ backgroundColor: "#F1D7AC" }}>
              <td>Male</td>
              <td>{data.attendanceMale.toLocaleString()}</td>
            </tr>
            <tr style={{ backgroundColor: "#F1D7AC" }}>
              <td>Female</td>
              <td>{data.attendanceFemale.toLocaleString()}</td>
            </tr>
            <tr style={{ backgroundColor: "#F1D7AC" }}>
              <td>Other</td>
              <td>{data.attendanceOther.toLocaleString()}</td>
            </tr>
            <tr style={{ backgroundColor: "#F1D7AC" }}>
              <td>Unknown</td>
              <td>{data.attendanceUnknown.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Materials Distributed</td>
              <td>{data.materialsDistributed.toLocaleString()}</td>
            </tr>
          </>
        }
      />
      {leadsData && (
        <div className="clients-table-container">
          {leadsData.length > 0 ? (
            <BasicTableReport
              title="Leads Attended"
              headerRows={
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              }
              contentRows={
                <>
                  {leadsData.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <Link to={`/leads/${lead.id}`}>{lead.id}</Link>
                      </td>
                      <td>{lead.fullName}</td>
                      <td>
                        {lead.leadStatus === "convertedToClient"
                          ? "converted to client"
                          : lead.leadStatus}
                      </td>
                    </tr>
                  ))}
                </>
              }
            />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
}
