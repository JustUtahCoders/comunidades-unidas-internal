import React from "react";
import { groupBy } from "lodash-es";
import { useCss } from "kremling";

export default React.forwardRef<ServicesRef, IntakeServicesInputsProps>(
  function IntakeServicesInputs(props, ref) {
    const [checkedServices, setCheckedServices] = React.useState<
      IntakeService[]
    >(props.checkedServices || []);

    const scope = useCss(css);
    const groupedServices = groupBy<Service>(props.services, "programName");

    React.useEffect(() => {
      // @ts-ignore
      ref.current = {
        checkedServices
      };
    });

    return (
      <div {...scope}>
        <div
          className="vertical-options"
          role="group"
          aria-label="Comunidades Unidas Services list"
        >
          {Object.entries(groupedServices).map(([programName, services]) => (
            <div key={programName}>
              <h3>{programName}</h3>
              {services.map(service => (
                <label key={service.id}>
                  <input
                    type="checkbox"
                    name="services"
                    value={service.id}
                    checked={checkedServices.some(
                      checkedService => checkedService.id === service.id
                    )}
                    onChange={handleChange}
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
        newCheckedServices = [
          ...checkedServices,
          props.services.find(service => service.id === serviceId)
        ];
      } else {
        newCheckedServices = checkedServices.filter(
          service => service.id !== serviceId
        );
      }
      setCheckedServices(newCheckedServices);
    }
  }
);

const css = `
  & h3 {
    font-size: 1.8rem;
  }

  & .vertical-options {
    display: block;
  }

  & .vertical-options > * {
    padding: .8rem 0;
  }

  & .vertical-options > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

export type IntakeService = {
  id: number;
  serviceName: string;
};

type IntakeServicesInputsProps = {
  services: Service[];
  checkedServices: IntakeService[];
};

type Service = {
  id: number;
  serviceName: string;
  programName: string;
};

type ServicesRef = {
  checkedServices: number[];
};
