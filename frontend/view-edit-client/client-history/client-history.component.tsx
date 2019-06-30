import React from "react";

export default function ClientHistory(props: ClientHistoryProps) {
  return <div>History!</div>;
}

type ClientHistoryProps = {
  path: string;
  exact: boolean;
};
