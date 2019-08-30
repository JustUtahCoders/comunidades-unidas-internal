import React from "react";
import ReactDOM from "react-dom";
import Root from "./root.component";
import axe from "react-axe";

ReactDOM.render(<Root />, document.getElementById("root"));

if (process.env.NODE_ENV !== "production") {
  axe(React, ReactDOM, 1000);
}
