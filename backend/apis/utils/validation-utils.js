const { get, isDefined } = require("lodash");
const emailValidator = require("email-validator");
const { validTagsList } = require("../tags/tag.utils");

exports.checkValid = function (obj, ...rules) {
  const result = rules.map((rule) => rule(obj)).filter((err) => err !== null);
  return result;
};

const checkDefined = (cbk) => (propertyName, ...args) => (obj) => {
  return typeof get(obj, propertyName) !== "undefined" &&
    get(obj, propertyName) !== null
    ? cbk(propertyName, ...args)(get(obj, propertyName), obj)
    : `Property ${propertyName} must be provided. Got '${get(
        obj,
        propertyName
      )}'`;
};

const nullable = (cbk) => (propertyName, ...args) => (obj) =>
  get(obj, propertyName) === null ||
  typeof get(obj, propertyName) === "undefined"
    ? null
    : cbk(propertyName, ...args)(get(obj, propertyName));

exports.nullableNonEmptyString = nullable(_nonEmptyString);
exports.nonEmptyString = checkDefined(_nonEmptyString);

exports.nullableValidDate = nullable(_validDate);
exports.validDate = checkDefined(_validDate);

exports.nullableValidTime = nullable(_validTime);
exports.validTime = checkDefined(_validTime);

exports.validId = checkDefined(_validId);
exports.nullableValidId = nullable(_validId);

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

exports.nullableValidCurrency = nullable(_validCurrency);
exports.validCurrency = checkDefined(_validCurrency);

exports.nullableValidTags = nullable(_validTags);
exports.validTags = checkDefined(_validTags);

exports.isDefined = checkDefined((propertyName) => (val) => null);

function _validDate(propertyName) {
  return (val) =>
    /^[0-9]{4}-[01][0-9]-[0123][0-9]$/.test(val) && !isNaN(new Date(val))
      ? null
      : `Property ${propertyName} must be a string date of format YYYY-MM-DD. Received '${val}'`;
}

function _validTime(propertyName) {
  return (val) =>
    /^[0-1][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(val)
      ? null
      : `Property ${propertyName} must be a string time of format HH:MM:SS. Recieved '${val}'`;
}

function _nonEmptyString(propertyName) {
  return (val) =>
    typeof val === "string" && val.trim().length > 0
      ? null
      : `Property ${propertyName} must be a non-whitespace, non-empty string. Received '${val}'`;
}

function _validEnum(propertyName, ...possibleValues) {
  return (val) =>
    possibleValues.includes(val)
      ? null
      : `Property ${propertyName} must be one of the following: ${possibleValues.join(
          ", "
        )}. Received '${val}'`;
}

function _validId(propertyName) {
  return (val) => {
    return isNaN(Number(val))
      ? `Property '${propertyName}' must be a valid number ID`
      : null;
  };
}

function _validPhone(propertyName) {
  return (val) =>
    /^[0-9\-\(\) x]+$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid phone number. Received '${val}'`;
}

function _validBoolean(propertyName) {
  return (val) =>
    typeof val === "boolean" || val === "true" || val === "false"
      ? null
      : `Property ${propertyName} must be a boolean. Received '${val}'`;
}

function _validState(propertyName) {
  return (val) =>
    typeof val === "string" && /^[A-Z]{2}$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid, capitalized, two-digit State abbreviation. Received '${val}'`;
}

function _validZip(propertyName) {
  return (val) =>
    typeof val === "string" && /^[0-9\-]+$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid ZIP code. Received '${val}'`;
}

function _validEmail(propertyName) {
  return (val) =>
    emailValidator.validate(val)
      ? null
      : `Property ${propertyName} must be a valid email address. Received '${val}'`;
}

function _validArray(propertyName, itemValidator, nullable) {
  return (obj) => {
    const val = obj[propertyName];

    if (Array.isArray(val)) {
      const validationErrorIndex = val.findIndex((item, index) => {
        return itemValidator(index)(val);
      });
      if (validationErrorIndex >= 0) {
        return `Property ${propertyName} is an array with an invalid item: ${JSON.stringify(
          itemValidator(validationErrorIndex)(val)
        )} - ${JSON.stringify(val[validationErrorIndex])}`;
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
  return (val) =>
    typeof val === "string" && /^[A-Z]{2}$/.test(val)
      ? null
      : `Property ${propertyName} must be a valid, capitalized, two-digit country code. Received '${val}`;
}

function _validInteger(propertyName) {
  return (val) =>
    Number.isInteger(Number(val))
      ? null
      : `Property ${propertyName} must be an integer. Received '${val}'`;
}

function _validCurrency(propertyName) {
  return (val) =>
    typeof val === "number" && Math.floor(val * 100) === val * 100
      ? null
      : `Property ${propertyName} must be a valid currency amount. Received '${val}'`;
}

function _validTags(propertyName, userPermissions) {
  return (val) => {
    if (typeof val === "string") {
      val = [val];
    }
    if (!Array.isArray(val) || val.some((v) => typeof v !== "string")) {
      return `Property ${propertyName} must be a string or array of strings`;
    }
    let err =
      val.find((v) =>
        validTagsList.includes(v)
          ? null
          : `Property ${propertyName} has invalid tag value '${v}'`
      ) || null;
    if (err) {
      return err;
    } else if (val.includes("immigration") && !userPermissions.immigration) {
      return `User cannot access immigration tag - insufficient permissions`;
    } else {
      return null;
    }
  };
}
