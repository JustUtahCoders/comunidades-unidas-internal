const { get } = require("lodash");
const emailValidator = require("email-validator");

exports.checkValid = function(obj, ...rules) {
  return rules.map(rule => rule(obj)).filter(err => err !== null);
};

const checkDefined = cbk => (propertyName, ...args) => obj =>
  typeof get(obj, propertyName) !== "undefined"
    ? cbk(propertyName, ...args)(get(obj, propertyName))
    : `Property ${propertyName} must be provided. Got '${get(
        obj,
        propertyName
      )}'`;

exports.nonEmptyString = checkDefined(propertyName => val =>
  typeof val === "string" && val.trim().length > 0
    ? null
    : `Property ${propertyName} must be a non-whitespace, non-empty string. Received '${val}'`
);
exports.validDate = checkDefined(propertyName => val =>
  /^[0-9]{4}-[01][0-9]-[0123][0-9]$/.test(val) && !isNaN(new Date(val))
    ? null
    : `Property ${propertyName} must be a string date of format YYYY-MM-DD. Received '${val}'`
);
exports.validPhone = checkDefined(propertyName => val =>
  /^[0-9\-\(\) x]+$/.test(val)
    ? null
    : `Property ${propertyName} must be a valid phone number. Received '${val}'`
);
exports.validBoolean = checkDefined(propertyName => val =>
  typeof val === "boolean"
    ? null
    : `Property ${propertyName} must be a boolean. Received '${val}'`
);
exports.validState = checkDefined(propertyName => val =>
  typeof val === "string" && /^[A-Z]{2}$/.test(val)
    ? null
    : `Property ${propertyName} must be a valid, capitalized, two-digit State abbreviation. Received '${val}'`
);
exports.validZip = checkDefined(propertyName => val =>
  typeof val === "string" && /^[0-9\-]+$/.test(val)
    ? null
    : `Property ${propertyName} must be a valid ZIP code. Received '${val}'`
);
exports.validEmail = checkDefined(propertyName => val =>
  emailValidator.validate(val)
    ? null
    : `Property ${propertyName} must be a valid email address. Received '${val}'`
);
exports.validEnum = checkDefined((propertyName, ...possibleValues) => val =>
  possibleValues.includes(val)
    ? null
    : `Property ${propertyName} must be one of the following: ${possibleValues.join(
        ", "
      )}. Received '${val}'`
);
exports.validCountry = checkDefined(propertyName => val =>
  typeof val === "string" && /^[A-Z]{2}$/.test(val)
    ? null
    : `Property ${propertyName} must be a valid, capitalized, two-digit country code. Received '${val}`
);
exports.validInteger = checkDefined(propertyName => val =>
  typeof val === "number" && Number.isInteger(val)
    ? null
    : `Property ${propertyName} must be an integer. Received '${val}'`
);
exports.isDefined = checkDefined(propertyName => val => null);
