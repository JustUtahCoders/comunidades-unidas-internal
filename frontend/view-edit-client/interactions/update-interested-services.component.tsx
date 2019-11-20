import React from "react";
import { SingleClient } from "../view-client.component";
import IntakeServicesInputs from "../../util/services-inputs.component";
import easyFetch from "../../util/easy-fetch";
import { useCss } from "kremling";

export default React.forwardRef(function UpdateInterestedServices(
  props: UpdateInterestedServicesProps,
  ref
) {
  const [intakeServices, setIntakeServices] = React.useState([]);
  const intakeServicesRef = React.useRef(null);
  const [clientInState, setClientInState] = React.useState(null);
  const scope = useCss(css);
  const client = props.client || clientInState;

  React.useEffect(() => {
    // @ts-ignore
    ref.current = {
      getNewInterestedServices: () =>
        intakeServicesRef.current
          ? intakeServicesRef.current.checkedServices
          : [],
      getOldInterestedServices: () => (client ? client.intakeServices : [])
    };
  });

  React.useEffect(() => {
    const abortController = new AbortController();
    easyFetch(`/api/services`, { signal: abortController.signal })
      .then(data => {
        setIntakeServices(data.services);
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
  }, []);

  React.useEffect(() => {
    if (props.clientToFetch) {
      const abortController = new AbortController();
      easyFetch(`/api/clients/${props.clientToFetch}`, {
        signal: abortController.signal
      })
        .then(d => {
          setClientInState(d.client);
        })
        .catch(err => {
          setTimeout(() => {
            throw Error(err);
          });
        });
    }
  }, [props.clientToFetch]);

  return (
    <div {...scope}>
      <h2>Interest in CU services</h2>
      <p className="caption">
        This list is the list of services the client has{" "}
        <strong>interest</strong> in. Not the list of the services that CU has
        already provided to them.
      </p>
      <div className="verticalOptions">
        {client && (
          <IntakeServicesInputs
            checkedServices={client.intakeServices}
            services={intakeServices}
            ref={intakeServicesRef}
          />
        )}
      </div>
    </div>
  );
});

const css = `
& .vertical-options label {
  display: block;
}
`;

type UpdateInterestedServicesProps = {
  clientToFetch: number;
  client?: SingleClient;
};
