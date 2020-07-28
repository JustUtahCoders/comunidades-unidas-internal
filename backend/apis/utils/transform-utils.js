const dateFormat = require("dateformat");

exports.responseDateWithoutTime = (date) => {
  if (date) {
    return dateFormat(date, "yyyy-mm-dd");
  } else {
    return null;
  }
};

exports.responseFullName = (firstName, lastName) =>
  `${firstName || ""} ${lastName || ""}`.trim();

exports.responseBoolean = (val) => {
  if (typeof val === "string") {
    return val !== "0" && val !== "false";
  } else if (val === null || undefined) {
    return null;
  } else {
    return Boolean(val);
  }
};

exports.requestEnum = (val) => (val ? val.toLowerCase() : null);
exports.requestPhone = (val) => (val ? val.replace(/[\(\)\-\s]/g, "") : null);

exports.responseUser = (user, timestamp) => {
  return {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: exports.responseFullName(user.firstName, user.lastName),
    timestamp,
  };
};
