import React from "react";

export function useFullWidth() {
  React.useLayoutEffect(() => {
    const mainContentEl = document.querySelector(".main-content");
    mainContentEl.classList.add("full");

    return () => {
      mainContentEl.classList.remove("full");
    };
  }, []);
}
