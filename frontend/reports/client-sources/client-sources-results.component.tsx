import React from "react";
import { useReportsApi } from "../shared/use-reports-api";

export default function ClientSourcesResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/client-sources`
  );

  return <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>;
}
