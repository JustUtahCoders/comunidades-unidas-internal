import React from "react";
import Modal from "../util/modal.component";
import { noop, cloneDeep } from "lodash-es";
import { CUService, CUProgram } from "../add-client/services.component";
import { maybe, useCss } from "kremling";
import easyFetch from "../util/easy-fetch";
import { showGrowl, GrowlType } from "../growls/growls.component";

export default function EditableProgramServiceRow(
  props: EditableProgramServiceRowProps
) {
  const [showingModal, setShowingModal] = React.useState(false);
  const trProps = props.canEdit ? { role: "button", tabIndex: 0 } : null;
  const scope = useCss(css);
  const [modifiedService, setModifiedService] = React.useState<CUService>(
    cloneDeep(props.service)
  );
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/services/${props.service.id}`, {
        method: "PATCH",
        body: {
          ...modifiedService,
          isActive: Boolean(modifiedService.isActive)
        }
      }).then(
        () => {
          showGrowl({
            message: "Service was updated",
            type: GrowlType.success
          });
          props.refetch();
          setShowingModal(false);
          setIsSaving(false);
        },
        err => {
          setTimeout(() => {
            throw err;
          });
          setIsSaving(false);
        }
      );

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving]);

  return (
    <>
      <tr
        {...scope}
        {...trProps}
        onClick={() => setShowingModal(props.canEdit)}
        className={maybe("clickable", props.canEdit)}
      >
        {props.children}
      </tr>
      {showingModal && (
        <Modal
          close={close}
          primaryText="Save"
          primaryAction={handleSubmit}
          secondaryText="Cancel"
          secondaryAction={close}
          headerText={`Modify ${props.service.serviceName}`}
        >
          <form {...scope}>
            <div className="form-group">
              <label htmlFor="service-name">Service name:</label>
              <input
                type="text"
                value={modifiedService.serviceName}
                onChange={evt =>
                  setModifiedService({
                    ...modifiedService,
                    serviceName: evt.target.value
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="service-description">Service description:</label>
              <input
                type="text"
                value={modifiedService.serviceDescription}
                onChange={evt =>
                  setModifiedService({
                    ...modifiedService,
                    serviceDescription: evt.target.value
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="service-program">Part of Program:</label>
              <select
                value={modifiedService.programId}
                onChange={evt =>
                  setModifiedService({
                    ...modifiedService,
                    programId: evt.target.value
                  })
                }
              >
                {props.programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.programName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="service-active">Is Active:</label>
              <input
                type="checkbox"
                checked={modifiedService.isActive}
                onChange={evt =>
                  setModifiedService({
                    ...modifiedService,
                    isActive: evt.target.checked
                  })
                }
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );

  function handleSubmit() {
    setIsSaving(true);
  }

  function close() {
    setShowingModal(false);
  }
}

const css = `
& .clickable {
  cursor: pointer;
}

& .clickable:hover {
  background-color: var(--medium-gray) !important;
}

& .form-group label {
  display: inline-block;
  margin: 1.6rem;
  min-width: 18rem;
}
`;

type EditableProgramServiceRowProps = {
  canEdit: boolean;
  service: CUService;
  programs: CUProgram[];
  refetch(): any;
  children: React.ReactElement | React.ReactElement[];
};
