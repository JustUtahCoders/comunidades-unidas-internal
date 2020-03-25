import React from "react";
import PageHeader from "../page-header.component";
import easyFetch from "../util/easy-fetch";
import { groupBy } from "lodash-es";
import BasicTableReport from "../reports/shared/basic-table-report.component";
import CollapsibleTableRows, {
  ToggleCollapseButton
} from "../reports/shared/collapsible-table-rows.component";
import { CUProgram, GroupedCUServices } from "../add-client/services.component";
import {
  UserContext,
  LoggedInUser,
  UserAccessLevel
} from "../util/user.context";
import EditableServiceRow from "./editable-service-row.component";
import { useCss } from "kremling";
import CreateNewServiceModal from "./create-new-service-modal.component";
import CreateNewProgramModal from "./create-new-program-modal.component";
import EditableProgramRow from "./editable-program-row.component";

export default function ProgramsAndServices(props) {
  const [shouldFetchServices, setShouldFetchServices] = React.useState(true);
  const [services, setServices] = React.useState<GroupedCUServices>({});
  const [programs, setPrograms] = React.useState<CUProgram[]>([]);
  const user = React.useContext<LoggedInUser>(UserContext);
  const scope = useCss(css);
  const [
    showingCreateNewServiceModal,
    setShowingCreateNewServiceModal
  ] = React.useState(false);
  const [
    showingCreateNewProgramModal,
    setShowingCreateNewProgramModal
  ] = React.useState(false);

  const canEdit = user.accessLevel === UserAccessLevel.Administrator;

  React.useEffect(() => {
    if (shouldFetchServices) {
      const abortController = new AbortController();

      easyFetch("/api/services?includeInactive=true", {
        signal: abortController.signal
      }).then(
        data => {
          const groupedServices = groupBy(data.services, "programId");
          setPrograms(data.programs);
          setServices(groupedServices);
          setShouldFetchServices(false);
        },
        err => {
          setTimeout(() => {
            throw err;
          });
        }
      );

      return () => abortController.abort();
    }
  }, [shouldFetchServices]);

  return (
    <>
      <PageHeader title="Programs and Services" />
      <div className="card" {...scope}>
        <p>
          This is the list of all Comunidades Unidas programs and services. A
          program consists of a group of services that are offered to CU's
          clients.
        </p>
        {canEdit && (
          <div className="actions">
            <button
              className="secondary"
              onClick={() => setShowingCreateNewProgramModal(true)}
            >
              New Program
            </button>
            <button
              className="primary"
              onClick={() => setShowingCreateNewServiceModal(true)}
            >
              New Service
            </button>
          </div>
        )}
        <BasicTableReport
          tableStyle={{ width: "100%" }}
          headerRows={
            <tr>
              <th style={{ minWidth: "30%", maxWidth: "30%", width: "30%" }}>
                Program Name
              </th>
              <th style={{ minWidth: "30%", maxWidth: "30%", width: "30%" }}>
                Service Name
              </th>
              <th style={{ minWidth: "30%", maxWidth: "30%", width: "30%" }}>
                Description
              </th>
              <th style={{ minWidth: "10%", maxWidth: "10%", width: "30%" }}>
                Active?
              </th>
            </tr>
          }
          contentRows={
            <>
              {programs.map(program => (
                <CollapsibleTableRows
                  key={program.id}
                  onlyButtonClick
                  everpresentRow={
                    <EditableProgramRow
                      refetch={refetchServices}
                      program={program}
                      key={program.id}
                      canEdit={canEdit}
                    >
                      <td>{program.programName}</td>
                      <td>
                        <ToggleCollapseButton />
                      </td>
                      <td style={{ fontSize: "1.4rem" }}>
                        {program.programDescription}
                      </td>
                      <td>{checkmark(program.isActive)}</td>
                    </EditableProgramRow>
                  }
                  collapsibleRows={(services[program.id] || []).map(service => (
                    <EditableServiceRow
                      key={service.id}
                      canEdit={canEdit}
                      service={service}
                      programs={programs}
                      refetch={refetchServices}
                    >
                      <td>&mdash;</td>
                      <td>{service.serviceName}</td>
                      <td style={{ fontSize: "1.4rem" }}>
                        {service.serviceDescription}
                      </td>
                      <td>{checkmark(service.isActive)}</td>
                    </EditableServiceRow>
                  ))}
                />
              ))}
            </>
          }
        />
      </div>
      {showingCreateNewServiceModal && (
        <CreateNewServiceModal
          programs={programs}
          close={() => setShowingCreateNewServiceModal(false)}
          refetch={refetchServices}
        />
      )}
      {showingCreateNewProgramModal && (
        <CreateNewProgramModal
          close={() => setShowingCreateNewProgramModal(false)}
          refetch={refetchServices}
        />
      )}
    </>
  );

  function refetchServices() {
    setShouldFetchServices(true);
  }
}

function checkmark(condition) {
  return (
    <div style={{ fontSize: "3.2rem", color: condition ? "green" : "red" }}>
      {condition ? "\u2611" : "\u2612"}
    </div>
  );
}

const css = `
& .actions {
  display: flex;
  justify-content: flex-end;
}
`;
