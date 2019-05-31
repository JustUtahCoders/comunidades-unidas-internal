import React from "react";

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

    return (
      <div>
        <div className="vertical-options">
          {props.services.map(service => (
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
};

type ServicesRef = {
  checkedServices: number[];
};
