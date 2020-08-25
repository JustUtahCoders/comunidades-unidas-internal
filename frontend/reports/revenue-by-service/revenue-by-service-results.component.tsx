import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import CollapsibleTableRows, {
  ToggleCollapseButton,
  ToggleAllButton,
} from "../shared/collapsible-table-rows.component";
import dayjs from "dayjs";
import { sumBy } from "lodash-es";

export default function InteractionsByService(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/revenue-by-service`
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading report</div>;
  }

  const groupedServices = data.programTotals.reduce((acc, program) => {
    acc[program.programId] = [];
    return acc;
  }, {});

  data.serviceTotals.forEach((service) => {
    groupedServices[service.programId].push(service);
  });

  const allProgramsGrandTotal = sumBy(data.programTotals, "totalPaid");

  return (
    <>
      <BasicTableReport
        title="Revenue By Program and Service"
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
        title="Summary"
        headerRows={
          <tr>
            <th></th>
            <th>Revenue</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <th>Invoice Payments</th>
              <td>${data.invoiceTotals.totalPaid.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Donations</th>
              <td>${data.donationTotals.totalPaid.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Other Payments</th>
              <td>
                $
                {(
                  data.allPaymentsTotals.totalPaid -
                  data.invoiceTotals.totalPaid -
                  data.donationTotals.totalPaid
                ).toFixed(2)}
              </td>
            </tr>
          </>
        }
        footerRows={
          <>
            <tr>
              <th>Grand Total</th>
              <td>
                $
                {(
                  data.allPaymentsTotals.totalPaid +
                  data.donationTotals.totalPaid
                ).toFixed(2)}
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
            <th>Revenue</th>
          </tr>
        }
        contentRows={data.programTotals.map((program) => (
          <CollapsibleTableRows
            key={program.programId}
            everpresentRow={
              <tr>
                <th>{program.programName}</th>
                <td>
                  <ToggleCollapseButton />
                </td>
                <td>${program.totalPaid.toFixed(2)}</td>
              </tr>
            }
            collapsibleRows={groupedServices[program.programId].map(
              (service) => (
                <tr key={service.serviceId}>
                  <td>{"\u2014"}</td>
                  <th>{service.serviceName}</th>
                  <td>${service.totalPaid.toFixed(2)}</td>
                </tr>
              )
            )}
          />
        ))}
        footerRows={
          <tr>
            <th>All programs</th>
            <td>
              <ToggleAllButton />
            </td>
            <td>${allProgramsGrandTotal.toFixed(2)}</td>
          </tr>
        }
      />
    </>
  );
}
