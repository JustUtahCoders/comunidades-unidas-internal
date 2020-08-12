import React from "react";
import PinwheelLoader from "./pinwheel-loader.component";

export default function PageLoader() {
  return (
    <div
      style={{
        height: `90vh`,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PinwheelLoader />
    </div>
  );
}
