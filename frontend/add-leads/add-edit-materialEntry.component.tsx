import { useCss } from "kremling";
import React from "react";
import css from "./add-edit-materialEntry.css";

export default function MaterialEntry({
  materialProp,
  handleDelete,
  handleEdit,
}) {
  const [editing, setEditing] = React.useState(false);
  const [material, setMaterial] = React.useState({ id: "", name: "" });

  React.useEffect(() => {
    setMaterial(materialProp);
  }, []);

  function OnValueChange(evt) {
    material.name = evt.target.value;
    setMaterial(material);
  }

  function onSave() {
    handleEdit(material);
    setEditing(!editing);
  }

  return (
    <div key={material.id} {...useCss(css)} className="container">
      {editing ? (
        <input defaultValue={material.name} onChange={OnValueChange} />
      ) : (
        <label>{material.name}</label>
      )}
      {editing ? (
        <button
          className="deleteButton"
          onClick={() => handleDelete(material.id)}
        >
          Delete
        </button>
      ) : (
        ""
      )}
      {editing ? (
        <button className="saveButton" onClick={onSave}>
          Save
        </button>
      ) : (
        ""
      )}

      {editing ? (
        <button
          className="cancelEditButtons"
          onClick={() => setEditing(!editing)}
        >
          Cancel
        </button>
      ) : (
        <button
          className="cancelEditButtons"
          onClick={() => setEditing(!editing)}
        >
          Edit
        </button>
      )}
    </div>
  );
}
