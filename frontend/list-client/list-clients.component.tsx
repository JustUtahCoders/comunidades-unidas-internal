import React, { useState } from "react";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";

export default function ListClients(props: ListClientsProps) {
  const scope = useCss(css);

  return (
    <div {...scope}>
      <PageHeader title="Search for a client" />
      <div className="card">
        <div className="form-with-hints">
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                <span>First Name</span>
                <input type="text" value={} onChange={} required />
              </label>
            </div>
            <div>
              <label>
                <span>First Name</span>
                <input type="text" value={} onChange={} required />
              </label>
            </div>
            <div className="actions">
              <button type="submit" className="primary">
                Next step
              </button>
              <button type="button" className="secondary" onClick={}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const css = `
& form > div {
  margin-bottom: 16rem;
}

& .form-with-hints {
  display: flex;
  justify-content: flex-start;
}

& .hints-and-instructions {
  width: 300rem;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16rem;
}

& .hint-icon {
  height: 70rem;
  margin-bottom: 16rem;
}

& .instruction {
  max-width: 200rem;
}

& label {
  display: flex;
  align-items: center;
}

& form > div > label > span {
  display: inline-block;
  width: 140rem;
  text-align: right;
  margin-right: 24rem;
}

& .actions {
  display: flex;
  justify-content: center;
  margin-top: 32rem;
}

& .vertical-options {
  display: block;
}
`;
