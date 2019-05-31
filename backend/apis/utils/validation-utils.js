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
exports.validDate = checkDefined(_validDate);

exports.validId = checkDefined(_validId);

exports.nullableValidPhone = nullable(_validPhone);
exports.validPhone = checkDefined(_validPhone);

exports.nullableValidBoolean = nullable(_validBoolean);
exports.validBoolean = checkDefined(_validBoolean);

exports.nullableValidState = nullable(_validState);
exports.validState = checkDefined(_validState);

exports.nullableValidZip = nullable(_validZip);
exports.validZip = checkDefined(_validZip);

exports.nullableValidEmail = nullable(_validEmail);
exports.validEmail = checkDefined(_validEmail);

exports.nullableValidEnum = nullable(_validEnum);
exports.validEnum = checkDefined(_validEnum);

exports.nullableValidArray = (propertyName, itemValidator) =>
  _validArray(propertyName, itemValidator, true);
exports.validArray = _validArray;

exports.nullableValidCountry = nullable(_validCountry);
exports.validCountry = checkDefined(_validCountry);

exports.nullableValidInteger = nullable(_validInteger);
exports.validInteger = checkDefined(_validInteger);

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

function _validBoolean(propertyName) {
  return val =>
    typeof val === "boolean"
      ? null
      : `Property ${propertyName} must be a boolean. Received '${val}'`;
}

function _validState(propertyName) {
  return val =>
    typeof val === "string" && /^[A-Z]{2}$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid, capitalized, two-digit State abbreviation. Received '${val}'`;
}

function _validZip(propertyName) {
  return val =>
    typeof val === "string" && /^[0-9\-]+$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid ZIP code. Received '${val}'`;
}

function _validEmail(propertyName) {
  return val =>
    emailValidator.validate(val)
      ? null
      : `Property ${propertyName} must be a valid email address. Received '${val}'`;
}

function _validArray(propertyName, itemValidator, nullable) {
  return obj => {
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
    } else if ((nullable && typeof val === "undefined") || val === null) {
      return null;
    } else {
      return `Property ${propertyName} must be an array.`;
    }
  };
}

function _validCountry(propertyName) {
  return val =>
    typeof val === "string" && /^[A-Z]{2}$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid, capitalized, two-digit country code. Received '${val}`;
}

function _validInteger(propertyName) {
  return val =>
    typeof val === "number" && Number.isInteger(val)
      ? null
      : `Property ${propertyName} must be an integer. Received '${val}'`;
}
