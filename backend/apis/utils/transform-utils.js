exports.responseDateWithoutTime = date => {
  const isoString = new Date(date).toISOString();
  return isoString.slice(0, isoString.indexOf("T"));
};

exports.requestEnum = val => val.toLowerCase();
exports.requestPhone = val => val.replace(/[\(\)\-\s]/g, "");
