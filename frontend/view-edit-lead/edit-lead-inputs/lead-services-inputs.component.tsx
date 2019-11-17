import React from "react";
import easyFetch from "../../util/easy-fetch";
import { IntakeService } from "../../util/services-inputs.component";
import IntakeServicesInputs from "../../util/services-inputs.component";

export default function LeadServicesInformationInputs(
  props: LeadServicesInformationInputsProps
) {
  const [services, setServices] = React.useState([]);
  const [leadServices, setLeadServices] = React.useState(
    props.lead.leadServices
  );
  const leadServicesRef = React.useRef(null);

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
    <form onSubmit={handleSubmit} autoComplete="off" className="edit-form">
      <IntakeServicesInputs
        ref={leadServicesRef}
        services={services}
        checkedServices={leadServices}
      />
      <div className="children-container">{props.children}</div>
    </form>
  );

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.handleSubmit(evt, {
      leadServices: leadServicesRef.current.checkedServices.map(
        service => service.id
      )
    });
  }
}

type LeadServicesInformationInputsProps = {
  lead: LeadServicesInfo;
  children: JSX.Element | JSX.Element[];
  handleSubmit(evt: Event, newState: LeadServicesInfo);
};

type LeadServicesInfo = {
  leadServices: Array<IntakeService>;
};
