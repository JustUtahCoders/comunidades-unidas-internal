exports.responseDateWithoutTime = date => {
  const isoString = new Date(date).toISOString();
  return isoString.slice(0, isoString.indexOf("T"));
};

exports.requestEnum = val => (val ? val.toLowerCase() : null);
exports.requestPhone = val => (val ? val.replace(/[\(\)\-\s]/g, "") : null);
