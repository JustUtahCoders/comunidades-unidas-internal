import { Link } from "@reach/router";
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
            <th>Service</th>
            <th>Question</th>
            <th>Question Type</th>
          </tr>
        }
        contentRows={
          <tr>
            <td>{data.reportParameters.serviceName}</td>
            <td>{data.reportParameters.questionName}</td>
            <td>
              {humanReadableCustomQuestionTypes[
                data.reportParameters.questionType
              ] || capitalize(data.reportParameters.questionType)}
            </td>
          </tr>
        }
      />
      {data.summary.columns.length > 0 && (
        <BasicTableReport
          headerRows={
            <tr>
              {data.summary.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          }
          contentRows={
            <tr>
              {data.summary.rows.map((r, i) => (
                <td key={i}>{r}</td>
              ))}
            </tr>
          }
        />
      )}
      <BasicTableReport
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
                <td>{a.answer}</td>
              </tr>
            ))}
          </>
        }
      />
    </>
  );
}
