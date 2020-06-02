exports.mysqlArrToJs = function mysqlArrToJs(mysqlArr) {
  if (mysqlArr === null) {
    return [];
  } else if (typeof mysqlArr === "string") {
    return JSON.parse(mysqlArr);
  } else if (Array.isArray(mysqlArr)) {
    return mysqlArr;
  } else {
    console.error(mysqlArr);
    throw Error(`Unknown mysqlArr type ${typeof mysqlArr}`);
  }
};
