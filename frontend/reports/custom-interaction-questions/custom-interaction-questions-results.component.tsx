import { Link } from "@reach/router";
import { isBoolean } from "lodash-es";
import React from "react";
import { humanReadableCustomQuestionTypes } from "../../programs-and-services/custom-question-inputs.component";
import BasicTableReport from "../shared/basic-table-report.component";
import { capitalize } from "../shared/report.helpers";
import { useReportsApi } from "../shared/use-reports-api";

export default function CustomInteractionQuestionResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/custom-interaction-questions`
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error Loading Report.</div>;
  }

  return (
    <>
      <BasicTableReport
        title={`Custom Interaction Questions`}
        headerRows={
          <tr>
            <th>Report Parameter</th>
            <th>Value</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <th>Service Name</th>
              <td>{data.reportParameters.serviceName}</td>
            </tr>
            <tr>
              <th>Question Name</th>
              <td>{data.reportParameters.questionName}</td>
            </tr>
            <tr>
              <th>Question Type</th>
              <td>
                {humanReadableCustomQuestionTypes[
                  data.reportParameters.questionType
                ] || capitalize(data.reportParameters.questionType)}
              </td>
            </tr>
            <tr>
              <th>Interaction Start Date</th>
              <td>{data.reportParameters.start || "\u2014"}</td>
            </tr>
            <tr>
              <th>Interaction End Date</th>
              <td>{data.reportParameters.end || "\u2014"}</td>
            </tr>
          </>
        }
      />
      {data.summary.columns.length > 0 && (
        <BasicTableReport
          title="Summary"
          headerRows={
            <tr>
              {data.summary.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          }
          contentRows={
            <>
              {data.summary.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </>
          }
        />
      )}
      <BasicTableReport
        title="Answers"
        headerRows={
          <tr>
            <th>Client ID</th>
            <th>Answer</th>
          </tr>
        }
        contentRows={
          <>
            {data.clientAnswers.map((a, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/clients/${a.clientId}`}>{a.clientId}</Link>
                </td>
                <td>
                  {isBoolean(a.answer) ? (a.answer ? "Yes" : "No") : a.answer}
                </td>
              </tr>
            ))}
          </>
        }
      />
    </>
  );
}
