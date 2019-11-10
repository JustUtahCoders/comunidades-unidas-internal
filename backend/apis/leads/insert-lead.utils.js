const mysql = require("mysql");

exports.insertLeadServicesQuery = function insertLeadServicesQuery(
  leadId,
  userId,
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

  let newLeadServicesQuery = "";
  const newLeadServicesQueryData = [];

  for (let i = 0; i < filteredNewLeadServices.map; i++) {
    newLeadServicesQuery = newLeadServicesQuery +=
      "INSERT INTO leadServices (leadId, serviceId) VALUES (?, ?); ";
    newLeadServicesQueryData.push(leadId, filteredNewLeadServices[i]);
  }

  newLeadServiesQuery = newLeadServicesQuery +=
    "UPDATE leads SET modifiedBy = ? WHERE id = ?";
  newLeadServicesQueryData.push(userId, leadId);

  return mysql.format(`${newLeadServicesQuery}`, newLeadServicesQueryData);
};

exports.insertLeadEventsQuery = function insertLeadEventsQuery(
  leadId,
  userId,
  leadEvents,
  oldLeadEvents
) {
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

  let newLeadEventsQuery = "";
  const newLeadEventsQueryData = [];

  for (let i = 0; i < filteredNewLeadEvents.map; i++) {
    newLeadEventsQuery = newLeadEventsQuery +=
      "INSERT INTO leadEvents (leadId, eventId) VALUES (?, ?); ";
    newLeadEventsQueryData.push(leadId, filteredNewLeadEvents[i]);
  }

  newLeadEventsQuery = newLeadEventsQuery +=
    "UPDATE leads SET modifiedBy = ? WHERE id = ?";
  newLeadEventsQueryData.push(userId, leadId);

  return mysql.format(`${newLeadEventsQuery}`, newLeadEventsQueryData);
};
