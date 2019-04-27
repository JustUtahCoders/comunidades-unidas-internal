import React, { useState } from "react";
import { useCss } from "kremling";
import PageHeader from "../page-header.component";
import SearchClient from "./search-client.component";

import { mediaMobile, mediaDesktop } from "../styleguide.component";

export default function ListClients(props: SearchClientProps) {
  const scope = useCss(css);
  return (
    <div {...scope}>
      <PageHeader title="List Clients" />
      <div className="card">
        <div className="form-with-hints">
          <SearchClient />
        </div>
      </div>
    </div>
  );
}

type SearchClientProps = {
  path: string;
};

const css = `
& form > div {
  margin-bottom: 16rem;
}

& .form-with-hints {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

& .hints-and-instructions {
  margin-bottom: 32rem;
}

& .form-with-hints form {
  align-self: center;
}

& .form-with-hints form input[type="checkbox"] {
  min-width: inherit;
  width: inherit;
  margin-right: 8rem;
}

${mediaMobile} {
  & .form-with-hints form input, & .form-with-hints form select {
    width: 170rem;
  }

  & .form-with-hints form {
    width: 350rem;
  }
}

${mediaDesktop} {
  & .form-with-hints form input, & .form-with-hints form select {
    min-width: 200rem;
    max-width: 300rem;
  }
}


& .hints-and-instructions {
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

& .vertical-options > * {
  padding: 8rem 0;
}
`;
