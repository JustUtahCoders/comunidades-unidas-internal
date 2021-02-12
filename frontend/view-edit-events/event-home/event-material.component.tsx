import React from "react";
import { useCss } from "kremling";
import css from "./event-material.css";

export default function EventMaterial(props) {
  function handleChange(evt) {
    const materialId = Number(evt.target.value);
    if (props.materialDistributed.some((m) => m.materialId === materialId)) {
      const filteredMaterials = props.materialDistributed.filter(
        (m) => m.materialId !== materialId
      );
      props.setMaterialDistributed(filteredMaterials);
    } else {
      const newMaterial = { materialId: materialId, quantityDistributed: 0 };
      props.setMaterialDistributed([...props.materialDistributed, newMaterial]);
    }
  }

  return (
    <div {...useCss(css)}>
      {props.materials.map((material) => {
        const materialDist = props.materialDistributed.find(
          (m) => m.materialId === material.id
        );
        const isChecked = Boolean(materialDist);
        return (
          <div key={material.id} className="checkboxAndInput">
            <input
              type="checkbox"
              id={`Material-${material.id}`}
              name="materials"
              onChange={handleChange}
              value={material.id}
              checked={isChecked}
            ></input>
            <label htmlFor={`Material-${material.id}`}>{material.name}</label>
            {isChecked && (
              <input
                className="inputs"
                type="number"
                placeholder="Quantity"
                min={0}
                value={materialDist.quantityDistributed}
                onChange={quantityChanged}
              />
            )}
          </div>
        );
        function quantityChanged(evt) {
          const newMaterialsDistributed = props.materialDistributed.map((m) => {
            if (m.materialId === material.id) {
              return {
                materialId: material.id,
                quantityDistributed: Number(evt.target.value),
              };
            } else {
              return m;
            }
          });
          props.setMaterialDistributed(newMaterialsDistributed);
        }
      })}
      <button
        className="secondary"
        type="button"
        onClick={() => props.setShowMaterials(true)}
      >
        Edit Materials
      </button>
    </div>
  );
}
