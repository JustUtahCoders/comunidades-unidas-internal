exports.integrationTypes = {
  JPLS: "Juntos Por La Salud"
};

exports.getIntegrationName = function(type) {
  const name = exports.integrationTypes[type];
  if (!name) {
    throw Error(`Server not configured for integration of type '${type}'`);
  }
  return name;
};
