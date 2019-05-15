import React from "react";
import easyFetch from "../util/easy-fetch";
import PageHeader from "../page-header.component";

export default function ViewClient(props: ViewClientProps) {
  const [client, setClient] = React.useState(null);
  const clientId = props.clientId;

  React.useEffect(() => {
    easyFetch(`/api/clients/${clientId}`)
      .then(data => {
        setClient(data.client);
      })
      .catch(err => {
        console.error(err);
        setClient(err.status);
      });
  }, [clientId]);

  return (
    <>
      <PageHeader title={getHeaderTitle()} />
      <div className="card">View client</div>
    </>
  );

  function getHeaderTitle() {
    if (client === 404) {
      return `Could not find client ${clientId}`;
    } else if (client === 400) {
      return `Invalid client id '${clientId}'`;
    } else if (client) {
      return `Client: ${client.fullName}`;
    } else {
      return "Loading client...";
    }
  }
}

type ViewClientProps = {
  path?: string;
  clientId?: string;
};
