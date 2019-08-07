import React from "react";
import { groupBy } from "lodash-es";

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

    return (
      <div>
        <div className="vertical-options">
          {Object.entries(groupedServices).map(([programName, services]) => (
            <div key={programName}>
              <h4>{programName}</h4>
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
