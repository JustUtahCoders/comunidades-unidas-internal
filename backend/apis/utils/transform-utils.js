exports.responseDateWithoutTime = date => {
  const isoString = new Date(date).toISOString();
  return isoString.slice(0, isoString.indexOf("T"));
};
exports.responseFullName = (firstName, lastName) =>
  `${firstName || ""} ${lastName || ""}`;

exports.responseBoolean = val => {
  if (typeof val === "string") {
    return val !== "0" && val !== "false";
  } else {
    return Boolean(val);
  }
};

exports.requestEnum = val => (val ? val.toLowerCase() : null);
exports.requestPhone = val => (val ? val.replace(/[\(\)\-\s]/g, "") : null);
