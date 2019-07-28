import React from "react";
import PageHeader from "../../page-header.component";
import ReportIssue from "../../report-issue/report-issue.component";
import SingleClientSearchInputComponent from "../../client-search/single-client/single-client-search-input.component";
import easyFetch from "../../util/easy-fetch";

export default function AddClientInteraction(props: AddClientInteractionProps) {
  if (!localStorage.getItem("client-interactions")) {
    return (
      <ReportIssue
        missingFeature
        hideHeader={!props.isGlobalAdd}
        title="Add client interaction"
      />
    );
  }

  const serviceSelectRef = React.useRef(null);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const abortController = new AbortController();

    easyFetch("/api/services", { signal: abortController.signal })
      .then(data => setServices(data.services))
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }, []);

  return (
    <>
      {props.isGlobalAdd && <PageHeader title="Add a client interaction" />}
      <form className="card" onSubmit={handleSubmit}>
        <SingleClientSearchInputComponent
          autoFocus
          nextThingToFocusRef={serviceSelectRef}
        />
        <select ref={serviceSelectRef}>
          {services.map(service => (
            <option key={service.id}>{service.serviceName}</option>
          ))}
        </select>
      </form>
    </>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    alert("handleSubmit not yet implemented");
  }
}

type AddClientInteractionProps = {
  path: string;
  isGlobalAdd?: boolean;
};
