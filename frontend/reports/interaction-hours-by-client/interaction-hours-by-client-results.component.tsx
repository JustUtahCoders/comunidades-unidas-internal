import React from "react";
import { useReportsApi } from "../shared/use-reports-api";

export default function InteractionHoursByClientResults(props) {
  const { isLoading, data, error } = useReportsApi(
    `/api/reports/interaction-hours-by-client`
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
