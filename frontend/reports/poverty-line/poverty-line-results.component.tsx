import React from "react";
import { useReportsApi } from "../shared/use-reports-api";

export default function PovertyLineResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/poverty-lines`
  );

  return <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>;
}
