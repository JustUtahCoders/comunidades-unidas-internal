import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { Link } from "@reach/router";
import backIcon from "../../../icons/148705-essential-collection/svg/back.svg";
import nextIcon from "../../../icons/148705-essential-collection/svg/next.svg";
import { useQueryParamState } from "../../util/use-query-param-state.hook";
import { useCss } from "kremling";
import { formatPhone } from "../../util/formatters";
import {
  secondsToHours,
  secondsToRemainderMinutes,
} from "../../util/time-duration-helpers";
import { CsvOptions } from "../../util/csv-utils";
import queryString from "query-string";
import easyFetch from "../../util/easy-fetch";
import { flatten } from "lodash-es";

export default function InteractionHoursByClientResults(props) {
  const { isLoading, data, error, fullUrl } = useReportsApi(
    `/api/reports/interaction-hours-by-client`
  );

  const scope = useCss(css);
  const [page, setPage] = useQueryParamState("page", "1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred.</div>;
  }

  return (
    <div {...scope}>
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
            <tr>
              <th>Min Interaction Hours</th>
              <td>
                {data.reportParameters.minInteractionSeconds ? (
                  <span>
                    {data.reportParameters.minInclusive
                      ? "At least "
                      : "More than "}
                    {secondsToHours(
                      data.reportParameters.minInteractionSeconds
                    )}{" "}
                    hrs,{" "}
                    {secondsToRemainderMinutes(
                      data.reportParameters.minInteractionSeconds
                    )}{" "}
                    mins
                  </span>
                ) : (
                  <span>&mdash;</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Max Interaction Hours</th>
              <td>
                {data.reportParameters.maxInteractionSeconds ? (
                  <span>
                    {data.reportParameters.minInclusive
                      ? "At most "
                      : "Less than "}
                    {secondsToHours(
                      data.reportParameters.maxInteractionSeconds
                    )}{" "}
                    hrs,{" "}
                    {secondsToRemainderMinutes(
                      data.reportParameters.maxInteractionSeconds
                    )}{" "}
                    mins
                  </span>
                ) : (
                  <span>&mdash;</span>
                )}
              </td>
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
      <div className="clients-table-container">
        <BasicTableReport
          title="Clients"
          getCsvOptions={getCsvOptions}
          headerRows={
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th># of interactions</th>
              <th># of hours</th>
            </tr>
          }
          contentRows={
            <>
              {data.clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link to={`/clients/${client.id}`}>{client.id}</Link>
                  </td>
                  <td>
                    {client.firstName} {client.lastName}
                  </td>
                  <td>{formatPhone(client.primaryPhone)}</td>
                  <td>{client.numInteractions}</td>
                  <td>{displayDuration(client.totalDuration)}</td>
                </tr>
              ))}
            </>
          }
        />
        <div className="pagination">
          <div>
            {(data.pagination.currentPage - 1) * data.pagination.pageSize + 1} -{" "}
            {Math.min(
              data.pagination.currentPage * data.pagination.pageSize,
              data.pagination.numClients
            )}{" "}
            of {data.pagination.numClients.toLocaleString()}
          </div>
          <button
            className="icon"
            onClick={goBack}
            disabled={Number(page) === 1}
          >
            <img
              src={backIcon}
              alt="Go back one page"
              title="Go back one page"
            />
          </button>
          <button
            className="icon"
            onClick={goForward}
            disabled={Number(page) === data.pagination.numPages}
          >
            <img
              src={nextIcon}
              alt="Go forward one page"
              title="Go forward one page"
            />
          </button>
        </div>
      </div>
    </div>
  );

  function displayDuration(duration) {
    const [hours, mins, seconds] = duration.split(":");
    return `${Number(hours)} hrs ${mins} mins`;
  }

  function goBack() {
    setPage(String(Number(page) - 1));
  }

  function goForward() {
    setPage(String(Number(page) + 1));
  }

  async function getCsvOptions(): Promise<CsvOptions> {
    const fetchPromises = [];
    const url = new URL(fullUrl, window.location.origin);
    const query = queryString.parse(url.href);
    delete query.page;
    url.search = queryString.stringify(query);
    const urlWithoutPage = url.href;

    for (let i = 1; i <= data.pagination.numPages; i++) {
      fetchPromises.push(easyFetch(urlWithoutPage + `&page=${i}`));
    }
    const pageData = await Promise.all(fetchPromises);
    const flatData = flatten(
      pageData.map((page) => {
        return page.clients;
      })
    );

    return {
      columnNames: [
        "id",
        "Name",
        "Phone",
        "Number of interactions",
        "Number of hours",
      ],
      data: flatData.map((client) => ({
        id: client.id,
        Name: `${client.firstName} ${client.lastName}`,
        Phone: formatPhone(client.primaryPhone),
        "Number of interactions": client.numInteractions,
        "Number of hours": displayDuration(client.totalDuration),
      })),
      fileName: `Interaction_Hours_By_Client.csv`,
    };
  }
}

const css = `
& .pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 5.5rem;
  left: calc(50% - 7rem);
  margin: 0 auto;
}

& .clients-table-container {
  position: relative;
}
`;
