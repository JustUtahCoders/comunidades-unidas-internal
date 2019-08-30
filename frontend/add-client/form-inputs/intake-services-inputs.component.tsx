import React from "react";
import { groupBy } from "lodash-es";
import { useCss } from "kremling";

export default React.forwardRef<ServicesRef, IntakeServicesInputsProps>(
  function IntakeServicesInputs(props, ref) {
    const [checkedServices, setCheckedServices] = React.useState(
      props.checkedServices || []
    );

    React.useEffect(() => {
      // @ts-ignore
      ref.current = {
        checkedServices
      };
    });

    const groupedServices = groupBy<Service>(props.services, "programName");

    const scope = useCss(css);

    return (
      <div {...scope}>
        <div
          className="vertical-options"
          role="group"
          aria-label="Comunidades Unidas Services list"
        >
          {Object.entries(groupedServices).map(([programName, services]) => (
            <div key={programName}>
              <h1>{programName}</h1>
              {services.map(service => (
                <label key={service.id}>
                  <input
                    type="checkbox"
                    name="services"
                    value={service.id}
                    checked={checkedServices.some(
                      checkedService => checkedService === service.id
                    )}
                    onChange={handleChange}
                    autoFocus
                  />
                  <span>{service.serviceName}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    function handleChange(evt) {
      const serviceId = Number(evt.target.value);
      let newCheckedServices;
      if (evt.target.checked) {
        newCheckedServices = [...checkedServices, serviceId];
      } else {
        newCheckedServices = checkedServices.filter(
          service => service !== serviceId
        );
      }
      setCheckedServices(newCheckedServices);
    }
  }
);

const css = `
& h1 {
  font-size: 1.8rem;
}
`;

type IntakeServicesInputsProps = {
  services: Service[];
  checkedServices: number[];
};

type Service = {
  id: number;
  serviceName: string;
  programName: string;
};

type ServicesRef = {
  checkedServices: number[];
};
