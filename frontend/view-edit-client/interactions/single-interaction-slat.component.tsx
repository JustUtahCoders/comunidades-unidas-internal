import React from "react";
import { useCss } from "kremling";
import { CUServicesList } from "../../add-client/services.component";

export default React.forwardRef<any, SingleClientInteractionProps>(
  function SingleClientInteraction(props, ref) {
    const scope = useCss(css);

    const services = props.servicesResponse
      ? props.servicesResponse.services
      : [];

    return (
      <div className="single-client-interaction" {...scope}>
        <div className="header">
          <h3 className="interaction-number">
            Interaction {props.interactionIndex + 1}
          </h3>
          {props.interactionIndex > 0 && (
            <button
              type="button"
              className="unstyled"
              onClick={props.removeInteraction}
            >
              {"\u24E7"}
            </button>
          )}
        </div>
        <select ref={ref}>
          {services.map(service => (
            <option key={service.id}>{service.serviceName}</option>
          ))}
        </select>
      </div>
    );
  }
);

const css = `
& .single-client-interaction {
  padding: .8rem .6rem;
  background-color: var(--colored-well);
  border-radius: .5rem;
  margin-top: 1.6rem;
}

& .interaction-number {
  margin-top: 0;
}

& .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

& .header button {
  cursor: pointer;
}
`;

type SingleClientInteractionProps = {
  servicesResponse: CUServicesList;
  interactionIndex: number;
  removeInteraction(): any;
};
