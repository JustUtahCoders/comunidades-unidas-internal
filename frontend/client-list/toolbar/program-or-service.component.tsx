import React, { useEffect, useState } from "react";
import { groupBy } from "lodash-es";
import css from "./program-or-service.css";
import { useCss } from "kremling";

export default function ProgramOrService({
  search,
  serviceData,
  updateAdvancedSearch,
  label,
  parseSuffix,
  includeDate,
}: ProgramOrServiceProps) {
  const [programOrService, setProgramOrService] = React.useState(
    search.parseResult.parse["service" + parseSuffix]
      ? "service" + parseSuffix
      : "program" + parseSuffix
  );

  const isProgram = programOrService.startsWith("program");

  const groupedServices = groupBy(serviceData.services, "programName");

  const startDateKey = isProgram
    ? `programStart${parseSuffix}`
    : `serviceStart${parseSuffix}`;
  const endDateKey = isProgram
    ? `programEnd${parseSuffix}`
    : `serviceEnd${parseSuffix}`;

  return (
    <>
      <div id={"advanced-search-program-or-service"}>{label}:</div>
      <div className="input-container" {...useCss(css)}>
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
            {isProgram ? (
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
        {includeDate && (
          <>
            <div className="date-range">
              <div>
                <label>Starting:</label>
              </div>
              <input
                type="date"
                value={search.parseResult.parse[startDateKey] || ""}
                onChange={(evt) =>
                  updateAdvancedSearch(startDateKey, evt.target.value)
                }
              />
            </div>
            <div className="date-range">
              <div>
                <label>Ending:</label>
              </div>
              <input
                type="date"
                value={search.parseResult.parse[endDateKey] || ""}
                onChange={(evt) =>
                  updateAdvancedSearch(endDateKey, evt.target.value)
                }
              />
            </div>
          </>
        )}
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
  includeDate?: boolean;
};
