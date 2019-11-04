import React from "react";

export function useFullWidth(enabled?: boolean) {
  React.useLayoutEffect(() => {
    if (enabled) {
      const mainContentEl = document.querySelector(".main-content");
      mainContentEl.classList.add("full");

      return () => {
        mainContentEl.classList.remove("full");
      };
    }
  }, [enabled]);
}
