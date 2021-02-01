import { useCss } from "kremling";
import React from "react";
import css from "./add-edit-materials.css";
import easyFetch from "../util/easy-fetch";
import MaterialEntry from "./add-edit-materialEntry.component";

export default function AddEditMaterials({
  addMaterial,
  deleteMaterial,
  editMaterial,
  materials,
}) {
  const [material, setMaterial] = React.useState({ name: "" });

  function handleSubmit(evt) {
    evt.preventDefault();

    const abortController = new AbortController();
    easyFetch(`/api/materials`, {
      signal: abortController.signal,
      method: "POST",
      body: material,
    })
      .then((data) => {
        addMaterial(data);
        setMaterial({ name: "" });
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => abortController.abort();
  }

  function handleChange(evt) {
    setMaterial({ name: evt.target.value });
  }

  function handleDelete(materialId) {
    const ac = new AbortController();
    easyFetch(`/api/materials/${materialId}`, {
      method: "DELETE",
      signal: ac.signal,
    })
      .then(() => {
        deleteMaterial(materialId);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      ac.abort();
    };
  }

  function handleEdit(material) {
    const ac = new AbortController();
    easyFetch(`/api/materials/${material.id}`, {
      method: "PATCH",
      signal: ac.signal,
      body: material,
    })
      .then(() => {
        editMaterial(material);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });

    return () => {
      ac.abort();
    };
  }

  return (
    <div {...useCss(css)}>
      {materials.map((m) => {
        return (
          <MaterialEntry
            key={m.id}
            materialProp={m}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        );
      })}
      <p>Add New Material</p>
      <form className="horizontal" onSubmit={handleSubmit}>
        <input
          className="longer"
          type="text"
          value={material.name}
          onChange={handleChange}
          required
          autoFocus
        />
        <button className="editAddButton primary" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
