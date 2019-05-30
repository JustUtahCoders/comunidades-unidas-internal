const { get, isDefined } = require("lodash");
const emailValidator = require("email-validator");

exports.checkValid = function(obj, ...rules) {
  const result = rules.map(rule => rule(obj)).filter(err => err !== null);
  return result;
};

const checkDefined = cbk => (propertyName, ...args) => obj => {
  return typeof get(obj, propertyName) !== "undefined" &&
    get(obj, propertyName) !== null
    ? cbk(propertyName, ...args)(get(obj, propertyName), obj)
    : `Property ${propertyName} must be provided. Got '${get(
        obj,
        propertyName
      )}'`;
};

const nullable = cbk => (propertyName, ...args) => obj =>
  get(obj, propertyName) === null ||
  typeof get(obj, propertyName) === "undefined"
    ? null
    : cbk(propertyName, ...args)(get(obj, propertyName));

exports.nullableNonEmptyString = nullable(_nonEmptyString);
exports.nonEmptyString = checkDefined(_nonEmptyString);
exports.nullableValidDate = nullable(_validDate);
exports.nullableValidInteger = nullable(_validInteger);
exports.validDate = checkDefined(_validDate);
exports.validId = checkDefined(_validId);
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

exports.nullableValidEnum = nullable(_validEnum);
exports.validEnum = checkDefined(_validEnum);
exports.validArray = (propertyName, itemValidator) => obj => {
  const val = obj[propertyName];

  if (Array.isArray(val)) {
    const validationError = val.find((item, index) => {
      return itemValidator(index)(val);
    });
    if (validationError) {
      return `Property ${propertyName} is an array with an invalid item: ${validationError}`;
    } else {
      return null;
    }
  } else {
    return `Property ${propertyName} must be an array.`;
  }
};

exports.validCountry = checkDefined(propertyName => val =>
  typeof val === "string" && /^[A-Z]{2}$/.test(val)
    ? null
    : `Property ${propertyName} must be a valid, capitalized, two-digit country code. Received '${val}`
);
exports.validInteger = checkDefined(propertyName => val => {
  return typeof val === "number" && Number.isInteger(val)
    ? null
    : `Property ${propertyName} must be an integer. Received '${val}'`;
});
exports.isDefined = checkDefined(propertyName => val => null);

function _validDate(propertyName) {
  return val =>
    /^[0-9]{4}-[01][0-9]-[0123][0-9]$/.test(val) && !isNaN(new Date(val))
      ? null
      : `Property ${propertyName} must be a string date of format YYYY-MM-DD. Received '${val}'`;
}

function _nonEmptyString(propertyName) {
  return val =>
    typeof val === "string" && val.trim().length > 0
      ? null
      : `Property ${propertyName} must be a non-whitespace, non-empty string. Received '${val}'`;
}

function _validEnum(propertyName, ...possibleValues) {
  return val =>
    possibleValues.includes(val)
      ? null
      : `Property ${propertyName} must be one of the following: ${possibleValues.join(
          ", "
        )}. Received '${val}'`;
}

function _validId(propertyName) {
  return val => {
    try {
      Number(val);
      return null;
    } catch (err) {
      return `Property '${propertyName}' must be a valid number ID`;
    }
  };
}

function _validInteger(propertyName) {
  return val =>
    typeof val == "number" && Number.isInteger(val)
      ? null
      : `Property '${propertyName}' must be a valid number. Received '${val}'`;
}
