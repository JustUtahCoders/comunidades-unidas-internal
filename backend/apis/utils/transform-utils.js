exports.dateWithoutTime = date => {
  const isoString = new Date(date).toISOString();
  return isoString.slice(0, isoString.indexOf("T"));
};
