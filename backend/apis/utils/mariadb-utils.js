exports.mariadbArrToJs = function mariadbArrToJs(mariadbArr) {
  if (mariadbArr === null) {
    return [];
  } else if (typeof mariadbArr === "string") {
    return JSON.parse(mariadbArr);
  } else if (Array.isArray(mariadbArr)) {
    return mariadbArr;
  } else {
    console.error(mariadbArr);
    throw Error(`Unknown mariadbArr type ${typeof mariadbArr}`);
  }
};
