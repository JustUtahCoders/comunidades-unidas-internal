import React from "react";
import { useReportsApi } from "../shared/use-reports-api";

export default function GenderResults(props) {
  const { isLoading, data, error } = useReportsApi(`/api/reports/genders`);

  return <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>;
}
