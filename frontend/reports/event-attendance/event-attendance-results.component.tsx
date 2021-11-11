import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { Link } from "@reach/router";
import { formatPhone } from "../../util/formatters";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";

export default function EventAttendanceResults(props) {
  const { isLoading, data, error } = useReportsApi(`/api/reports/events`);

  const clients = [
    {
      id: 0,
      firstName: "John",
      lastName: "Adams",
    },
    {
      id: 1,
      firstName: "Sally",
      lastName: "Jones",
    },
  ];

  const leads = [
    {
      id: 0,
      firstName: "Darth",
      lastName: "Vader",
    },
    {
      id: 1,
      firstName: "Indiana",
      lastName: "Jones",
    },
  ];

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

            {/*<div className="clients-table-container">*/}
            {/*  <BasicTableReport*/}
            {/*    title="Clients"*/}
            {/*    // getCsvOptions={}*/}
            {/*    headerRows={*/}
            {/*      <tr>*/}
            {/*        <th>ID</th>*/}
            {/*        <th>Name</th>*/}
            {/*        <th>Phone</th>*/}
            {/*        <th># of interactions</th>*/}
            {/*        <th># of hours</th>*/}
            {/*      </tr>*/}
            {/*    }*/}
            {/*    contentRows={*/}
            {/*      <>*/}
            {/*        {data.clients.map((client) => (*/}
            {/*          <tr key={client.id}>*/}
            {/*            <td>*/}
            {/*              <Link to={`/clients/${client.id}`}>{client.id}</Link>*/}
            {/*            </td>*/}
            {/*            <td>*/}
            {/*              {client.firstName} {client.lastName}*/}
            {/*            </td>*/}
            {/*            <td>{formatPhone(client.primaryPhone)}</td>*/}
            {/*            <td>{client.numInteractions}</td>*/}
            {/*            /!* <td>{displayDuration(client.totalDuration)}</td> *!/*/}
            {/*          </tr>*/}
            {/*        ))}*/}
            {/*      </>*/}
            {/*    }*/}
            {/*  />*/}
            {/*  <div className="pagination">*/}
            {/*    <div>*/}
            {/*      {(data.pagination.currentPage - 1) * data.pagination.pageSize + 1} -{" "}*/}
            {/*      {Math.min(*/}
            {/*        data.pagination.currentPage * data.pagination.pageSize,*/}
            {/*        data.pagination.numClients*/}
            {/*      )}{" "}*/}
            {/*      of {data.pagination.numClients.toLocaleString()}*/}
            {/*    </div>*/}
            {/*    <button*/}
            {/*      className="icon"*/}
            {/*      // onClick={goBack}*/}
            {/*      // disabled={Number(page) === 1}*/}
            {/*    >*/}
            {/*      <img*/}
            {/*        src={backIcon}*/}
            {/*        alt="Go back one page"*/}
            {/*        title="Go back one page"*/}
            {/*      />*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*      className="icon"*/}
            {/*      onClick={goForward}*/}
            {/*      disabled={Number(page) === data.pagination.numPages}*/}
            {/*    >*/}
            {/*      <img*/}
            {/*        src={nextIcon}*/}
            {/*        alt="Go forward one page"*/}
            {/*        title="Go forward one page"*/}
            {/*      />*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </>
        }
      />
      <div className="clients-table-container">
        <BasicTableReport
          title="Leads Attended"
          headerRows={
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          }
          contentRows={
            <>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link to={`/leads/${lead.id}`}>{lead.id}</Link>
                  </td>
                  <td>
                    {lead.firstName} {lead.lastName}
                  </td>
                </tr>
              ))}
            </>
          }
        />
      </div>
    </>
  );
}
