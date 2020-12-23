import React from "react";
import ReactDOM from "react-dom";
import Root from "./root.component";

ReactDOM.render(<Root />, document.getElementById("root"));

// @ts-ignore
if (process.env.NODE_ENV !== "production") {
  import("react-axe").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
