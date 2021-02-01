import { useCss } from "kremling";
import React from "react";
import css from "./add-edit-materials.css";
import easyFetch from "../util/easy-fetch";
import AddEditMaterial from "./add-edit-material.component";
import { handlePromiseError } from "../util/error-helpers";

export default function AddEditMaterials({
  addMaterial,
  deleteMaterial,
  editMaterial,
  materials,
}) {
  const [material, setMaterial] = React.useState({ name: "" });
  const [isCreating, setIsCreating] = React.useState(false);
  const [materialToDelete, setMaterialToDelete] = React.useState(false);
  const [materialToUpdate, setMaterialToUpdate] = React.useState<
    false | FullMaterial
  >(false);

  React.useEffect(() => {
    if (isCreating) {
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
        .catch(handlePromiseError)
        .finally(() => {
          setIsCreating(false);
        });

      return () => abortController.abort();
    }
  }, [isCreating]);

  React.useEffect(() => {
    if (materialToDelete) {
      const ac = new AbortController();
      easyFetch(`/api/materials/${materialToDelete}`, {
        method: "DELETE",
        signal: ac.signal,
      })
        .then(() => {
          deleteMaterial(materialToDelete);
        })
        .catch(handlePromiseError)
        .finally(() => {
          setMaterialToDelete(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [materialToDelete]);

  React.useEffect(() => {
    if (materialToUpdate) {
      const ac = new AbortController();
      easyFetch(`/api/materials/${materialToUpdate.id}`, {
        method: "PATCH",
        signal: ac.signal,
        body: materialToUpdate,
      })
        .then(() => {
          editMaterial(materialToUpdate);
        })
        .catch(handlePromiseError)
        .finally(() => {
          setMaterialToUpdate(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [materialToUpdate]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsCreating(true);
  }

  function handleChange(evt) {
    setMaterial({ name: evt.target.value });
  }

  function handleDelete(materialId) {
    setMaterialToDelete(materialId);
  }

  function handleEdit(material) {
    setMaterialToUpdate(material);
  }

  return (
    <div {...useCss(css)}>
      {materials.map((m) => {
        return (
          <AddEditMaterial
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

type FullMaterial = {
  id: number;
  name: string;
};
