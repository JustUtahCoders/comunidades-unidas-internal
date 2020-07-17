exports.atLeastOne = function atLeastOne(fullObj, ...propertyNames) {
  let obj = fullObj;
  return propertyNames.some((propertyName) => {
    obj = fullObj;
    const paths = propertyName.split(".");

    return paths.every((path, index) => {
      if (!obj) {
        return false;
      } else if (index === paths.length - 1) {
        return obj.hasOwnProperty(path);
      } else {
        return (obj = obj[path]);
      }
    });
  });
};
