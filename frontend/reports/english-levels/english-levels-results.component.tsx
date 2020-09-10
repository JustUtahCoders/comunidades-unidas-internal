import React from "react";
import { useReportsApi } from "../shared/use-reports-api";
import BasicTableReport from "../shared/basic-table-report.component";
import dayjs from "dayjs";
import { formatPercentage, capitalize } from "../shared/report.helpers";
import { sum, values } from "lodash-es";

export default function EnglishLevelsResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/english-levels`
  );

  if (!data) {
    return null;
  }

  const totalClients = sum(values(data.englishLevels));

  return (
    <div>
      <BasicTableReport
        title="Client Date Of Intake Range"
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
        footerRows={
          <tr>
            <th>Total Clients</th>
            <td>{totalClients.toLocaleString()}</td>
          </tr>
        }
      />
      <BasicTableReport
        title="Self Reported Client English Levels"
        headerRows={
          <tr>
            <th>English Level</th>
            <th>Client count</th>
            <th>Percentage</th>
          </tr>
        }
        contentRows={
          <>
            {Object.keys(data.englishLevels)
              .sort(englishLevelComparator)
              .map((englishLevel) => (
                <tr key={englishLevel}>
                  <th>{capitalize(englishLevel)}</th>
                  <td>{data.englishLevels[englishLevel].toLocaleString()}</td>
                  <td>
                    {formatPercentage(
                      data.englishLevels[englishLevel].toLocaleString(),
                      totalClients
                    )}
                  </td>
                </tr>
              ))}
          </>
        }
        footerRows={
          <>
            <tr>
              <th>Total</th>
              <td>{totalClients.toLocaleString()}</td>
              <td>100%</td>
            </tr>
          </>
        }
      />
    </div>
  );
}

const scores = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

function englishLevelComparator(level1, level2) {
  return scores[level1] - scores[level2];
}
