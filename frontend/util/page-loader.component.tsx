import React from "react";
import pinwheelUrl from "../../icons/loaders/pinwheel.gif";

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
      <img src={pinwheelUrl} alt="Pinwheel spinning" />
    </div>
  );
}
