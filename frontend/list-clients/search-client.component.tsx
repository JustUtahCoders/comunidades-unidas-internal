import React, { useState } from "react";
import { useCss } from "kremling";
import searchUrl from "../../icons/148705-essential-collection/svg/search.svg";

export default function SearchClient() {
  return (
    <>
      <div className="hints-and-instructions">
        <div>
          <img src={searchUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          Search for client by name or by zipcode or both.
        </div>
      </div>
    </>
  );
}
