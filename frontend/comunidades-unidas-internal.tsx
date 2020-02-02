import React from "react";
import ReactDOM from "react-dom";
import Root from "./root.component";

ReactDOM.render(<Root />, document.getElementById("root"));

if (process.env.NODE_ENV !== "production") {
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}
