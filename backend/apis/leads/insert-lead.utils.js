const mysql = require("mysql");

exports.insertLeadServicesQuery = function insertLeadServicesQuery(
  leadId,
  leadServices,
  oldLeadServices
) {
  const filteredNewLeadServices = leadServices.filter(function(lead) {
    let match = false;

    console.log(oldLeadServices);

    for (let i = 0; i < oldLeadServices.length; i++) {
      if (match === false) {
        if (oldLeadServices[i] === lead) {
          match = true;
        }
      }
    }

    if (match === false) {
      return lead;
    } else {
      return;
    }
  });

  console.log(filteredNewLeadServices);

  return mysql.format(
    `
			${leadServices
        .map(() => {
          return "INSERT INTO leadServices (leadId, serviceId) VALUES (@leadDataId, ?); ";
        })
        .join("")}
		`,
    leadServices
  );
};

exports.insertLeadEventsQuery = function insertLeadEventsQuery(
  leadId,
  leadEvents
) {
  return mysql.format(
    `
			${leadEvents
        .map(() => {
          return "INSERT INTO leadEvents (leadId, eventId) VALUES (@leadDataId, ?); ";
        })
        .join("")}
		`,
    leadEvents
  );
};
