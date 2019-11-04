import React from "react";

export default function LeadRow({ lead, deleteLead, updateLead, canDelete }) {
  const input = (field, label) => (
    <input
      style={{ width: "100%" }}
      value={lead[field] || ""}
      onChange={e => updateLead(field, e.target.value)}
      aria-label={label}
    />
  );

  return (
    <tr>
      <td>{input("firstName", "First")}</td>
      <td>{input("lastName", "Last")}</td>
      <td>{input("phone", "Phone")}</td>
      <td>{input("zip", "Zip")}</td>
      <td>{input("age", "Age")}</td>
      <td>
        <select style={{ width: "100%" }}>
          <option></option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
      </td>
      <td>
        <input type="checkbox" />
      </td>
      <td></td>
      <td>{canDelete && <button onClick={deleteLead}>x</button>}</td>
    </tr>
  );
}
