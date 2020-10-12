import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import { formatPercentage, formatDuration } from "../shared/report.helpers";
import CollapsibleTableRows, {
  ToggleCollapseButton,
  ToggleAllButton,
} from "../shared/collapsible-table-rows.component";
import dayjs from "dayjs";

export default function InteractionsByService(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/referrals-by-service`
  );

  if (isLoading || error) {
    return <div>"Loading..."</div>;
  }

  const clientsTotal = calcClientsTotal(data.partners);
  const leadsTotal = calcLeadsTotal(data.partners);
  const grandTotal = clientsTotal + leadsTotal;

  return (
    <>
      <BasicTableReport
        title="Referrals By Service"
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
            <th>Partner</th>
            <th style={{ width: "20%" }}>Service</th>
            <th>Client Referrals</th>
            <th>Lead Referrals</th>
            <th>Total Referrals</th>
          </tr>
        }
        contentRows={data.partners.map((partner) => (
          <CollapsibleTableRows
            key={partner.partnerId}
            everpresentRow={
              <tr>
                <th>{partner.partnerName}</th>
                <td>
                  <ToggleCollapseButton />
                </td>
                <td>{partner.clientReferralCount.toLocaleString()}</td>
                <td>{partner.leadReferralCount.toLocaleString()}</td>
                <td>
                  {(
                    partner.leadReferralCount + partner.clientReferralCount
                  ).toLocaleString()}
                </td>
              </tr>
            }
            collapsibleRows={partner.services.map((service) => (
              <tr key={service.partnerServiceId}>
                <td>{"\u2014"}</td>
                <th>{service.partnerServiceName}</th>
                <td>{service.clientReferralCount.toLocaleString()}</td>
                <td>{service.leadReferralCount.toLocaleString()}</td>
                <td>
                  {(
                    service.leadReferralCount + service.clientReferralCount
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          />
        ))}
        footerRows={
          <tr>
            <td>All Partners</td>
            <td>{"\u2014"}</td>
            <td>{clientsTotal.toLocaleString()}</td>
            <td>{leadsTotal.toLocaleString()}</td>
            <td>{grandTotal.toLocaleString()}</td>
          </tr>
        }
      />
    </>
  );
}

function calcClientsTotal(partners) {
  return partners.reduce((total, partner) => {
    return total + partner.clientReferralCount;
  }, 0);
}

function calcLeadsTotal(partners) {
  return partners.reduce((total, partner) => {
    return total + partner.leadReferralCount;
  }, 0);
}
