import React from "react";
import { groupBy } from "lodash-es";

export default function ProgramOrService({
  search,
  serviceData,
  updateAdvancedSearch
}) {
  const [programOrService, setProgramOrService] = React.useState("program");
  const groupedServices = groupBy(serviceData.services, "programName");
  console.log("groupedServices", groupedServices);

  return (
    <>
      <div id={"advanced-search-program-or-service"}>Interest:</div>
      <div>
        <label>
          <input
            type="radio"
            name="program-or-service"
            checked={programOrService === "program"}
            onChange={evt => setProgramOrService("program")}
          />
          <span>Program</span>
        </label>
        <label>
          <input
            type="radio"
            name="program-or-service"
            checked={programOrService === "service"}
            onChange={evt => setProgramOrService("service")}
          />
          <span>Service</span>
        </label>
        <div>
          {programOrService === "program" ? (
            <select
              value={search.parseResult.parse[programOrService]}
              onChange={evt => {
                updateAdvancedSearch(programOrService, evt.target.value);
              }}
            >
              <option value="">No program selected</option>
              {serviceData.programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={search.parseResult.parse[programOrService]}
              onChange={evt => {
                updateAdvancedSearch(programOrService, evt.target.value);
              }}
            >
              <option value="">No service selected</option>
              {Object.keys(groupedServices).map(programName => (
                <optgroup label={programName} key={programName}>
                  {groupedServices[programName].map(service => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>
      </div>
    </>
  );
}
