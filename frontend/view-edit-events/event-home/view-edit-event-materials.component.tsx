import { cloneDeep } from "lodash-es";
import React from "react";
import AddEditMaterials from "../../add-leads/add-edit-materials.component";
import { GrowlType, showGrowl } from "../../growls/growls.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import Modal from "../../util/modal.component";
import { SingleEvent } from "../view-event.component";
import EventMaterial from "./event-material.component";
import EventSection from "./event-section.component";
import { useCss } from "kremling";

export default function ViewEditEventMaterials(
  props: ViewEditEventMaterialsProps
) {
  const scope = useCss(css);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [materialsDistributed, setMaterialsDistributed] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);
  const [showMaterials, setShowMaterials] = React.useState(false);

  React.useEffect(() => {
    if (!isEditing) {
      setMaterialsDistributed(cloneDeep(props.event.materialsDistributed));
    }
  }, [isEditing, props.event.materialsDistributed]);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/materials`, { signal: ac.signal })
      .then(setMaterials)
      .catch(handlePromiseError);
    return () => {
      ac.abort();
    };
  }, []);

  React.useEffect(() => {
    if (isSaving) {
      const abortController = new AbortController();
      easyFetch(`/api/events/${props.event.id}`, {
        method: "PATCH",
        signal: abortController.signal,
        body: {
          materialsDistributed: materialsDistributed,
        },
      })
        .then((updatedEvent) => {
          props.eventUpdated(updatedEvent);
          showGrowl({ type: GrowlType.success, message: "Event was updated." });
          setIsEditing(false);
        })
        .catch(handlePromiseError)
        .finally(() => {
          setIsSaving(false);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [isSaving]);

  return (
    <EventSection title="Materials Distributed">
      {props.event.materialsDistributed.length > 0 ? (
        isEditing ? (
          <EventMaterial
            materials={materials}
            materialDistributed={materialsDistributed}
            setMaterialDistributed={setMaterialsDistributed}
            setShowMaterials={setShowMaterials}
          />
        ) : (
          <BasicTableReport
            headerRows={
              <>
                <tr>
                  <th>Material</th>
                  <th>Quantity Distributed</th>
                </tr>
              </>
            }
            contentRows={
              <>
                {props.event.materialsDistributed.map((m) => (
                  <tr key={m.materialId}>
                    <td>{m.name}</td>
                    <td>{m.quantityDistributed.toLocaleString()}</td>
                  </tr>
                ))}
              </>
            }
          />
        )
      ) : (
        <h5>(No materials distributed)</h5>
      )}

      <div className="editButton" {...scope}>
        {isEditing ? (
          <>
            <button className="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="primary" onClick={() => setIsSaving(true)}>
              Save
            </button>
          </>
        ) : (
          <button className="primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
      {showMaterials && (
        <Modal headerText="Edit Materials" close={closeShowMaterials}>
          <AddEditMaterials
            addMaterial={addMaterial}
            deleteMaterial={deleteMaterial}
            editMaterial={editMaterial}
            materials={materials}
          />
        </Modal>
      )}
    </EventSection>
  );

  function addMaterial(material) {
    setMaterials([...materials, material]);
  }

  function deleteMaterial(materialId) {
    setMaterials(materials.filter((m) => m.id !== materialId));
  }

  function editMaterial(material) {
    const updateMaterial = materials.map((m) => {
      if (m.id === material.id) return material;
      return m;
    });
    setMaterials(updateMaterial);
  }

  function closeShowMaterials() {
    setShowMaterials(false);
  }
}

type ViewEditEventMaterialsProps = {
  event: SingleEvent;
  eventUpdated(event: SingleEvent): void;
};

const css = `
 & .editButton {
  margin-top: 1.6rem;
}
`;
