import React from "react";
import { useReportsApi } from "../shared/use-reports-api";

export default function AgesResults(props) {
  const { isLoading, data, error } = useReportsApi(`/api/reports/ages`);

  return <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>;
}
