import React from "react";
import { groupBy } from "lodash-es";

export default function ProgramOrService({
  search,
  serviceData,
  updateAdvancedSearch,
  label,
  parseSuffix,
}: ProgramOrServiceProps) {
  const [programOrService, setProgramOrService] = React.useState(
    search.parseResult.parse.service
      ? "service" + parseSuffix
      : "program" + parseSuffix
  );
  const groupedServices = groupBy(serviceData.services, "programName");

  return (
    <>
      <div id={"advanced-search-program-or-service"}>{label}:</div>
      <div>
        <label>
          <input
            type="radio"
            name={`program-or-service-${parseSuffix}`}
            checked={programOrService === "program" + parseSuffix}
            onChange={(evt) => setProgramOrService("program" + parseSuffix)}
          />
          <span>Program</span>
        </label>
        <label>
          <input
            type="radio"
            name={`program-or-service-${parseSuffix}`}
            checked={programOrService === "service" + parseSuffix}
            onChange={(evt) => setProgramOrService("service" + parseSuffix)}
          />
          <span>Service</span>
        </label>
        <div>
          {programOrService === "program" + parseSuffix ? (
            <select
              value={search.parseResult.parse[programOrService]}
              onChange={(evt) => {
                updateAdvancedSearch(programOrService, evt.target.value);
              }}
            >
              <option value="">No program selected</option>
              {serviceData.programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={search.parseResult.parse[programOrService]}
              onChange={(evt) => {
                updateAdvancedSearch(programOrService, evt.target.value);
              }}
            >
              <option value="">No service selected</option>
              {Object.keys(groupedServices).map((programName) => (
                <optgroup label={programName} key={programName}>
                  {groupedServices[programName].map((service) => (
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

type ProgramOrServiceProps = {
  search: any;
  serviceData: any;
  updateAdvancedSearch(programOrService: string, value: string): any;
  label: string;
  parseSuffix: string;
};
