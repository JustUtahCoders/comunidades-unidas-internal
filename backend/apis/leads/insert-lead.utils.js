const mysql = require("mysql");

exports.insertLeadServicesQuery = function insertLeadServicesQuery(
  leadId,
  leadServices,
  oldLeadServices
) {
  const filteredNewLeadServices = leadServices.filter(function(service) {
    let match = false;

    for (let i = 0; i < oldLeadServices.length; i++) {
      if (match === false) {
        if (oldLeadServices[i].id === service) {
          match = true;
        }
      }
    }

    if (match === false) {
      return service;
    } else {
      return;
    }
  });

  return mysql.format(
    `
			${filteredNewLeadServices
        .map(() => {
          return "INSERT INTO leadServices (leadId, serviceId) VALUES (@leadDataId, ?); ";
        })
        .join("")}
		`,
    filteredNewLeadServices
  );
};

exports.insertLeadEventsQuery = function insertLeadEventsQuery(
  leadId,
  leadEvents,
  oldLeadEvents
) {
  console.log(oldLeadEvents);

  const filteredNewLeadEvents = leadEvents.filter(function(event) {
    let match = false;

    for (let i = 0; i < oldLeadEvents.length; i++) {
      if (match === false) {
        if (oldLeadEvents[i].id === event) {
          match = true;
        }
      }
    }

    if (match === false) {
      return event;
    } else {
      return;
    }
  });

  return mysql.format(
    `
			${filteredNewLeadEvents
        .map(() => {
          return "INSERT INTO leadEvents (leadId, eventId) VALUES (@leadDataId, ?); ";
        })
        .join("")}
		`,
    leadEvents
  );
};
