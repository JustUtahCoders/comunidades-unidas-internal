exports.atLeastOne = function atLeastOne(obj, ...propertyNames) {
  return propertyNames.some((propertyName) => obj.hasOwnProperty(propertyName));
};
