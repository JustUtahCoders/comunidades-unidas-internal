import { useCss } from "kremling";
import React from "react";
import css from "./add-edit-material.css";

export default function AddEditMaterial({
  materialProp,
  handleDelete,
  handleEdit,
}) {
  const [editing, setEditing] = React.useState(false);
  const [material, setMaterial] = React.useState({ id: "", name: "" });

  React.useEffect(() => {
    setMaterial(materialProp);
  }, []);

  function onValueChange(evt) {
    setMaterial({ ...material, name: evt.target.value });
  }

  function onSave() {
    handleEdit(material);
    setEditing(!editing);
  }

  return (
    <div {...useCss(css)} className="container">
      {editing ? (
        <input value={material.name} onChange={onValueChange} />
      ) : (
        <label>{material.name}</label>
      )}
      {editing && (
        <button
          className="deleteButton"
          onClick={() => handleDelete(material.id)}
        >
          Delete
        </button>
      )}
      {editing && (
        <button className="saveButton" onClick={onSave}>
          Save
        </button>
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
