const mysql = require("mysql");
const { app, databaseError, pool, invalidRequest } = require("../../server");
const {
  checkValid,
  nonEmptyString,
  validArray,
  validBoolean,
  validDate,
  validInteger
} = require("../utils/validation-utils");

app.post("/api/leads", (req, res) => {
  const leads = req.body.data;
  const user = req.session.passport.user;

  if (!Array.isArray(leads)) {
    return invalidRequest(res, [
      `POST /api/leads must be called with an array of leads in the request body`
    ]);
  }

  for (let i = 0; i < leads.length; i++) {
    const validityErrors = checkValid(
      leads[i],
      validDate("dateOfSignUp"),
      nonEmptyString("firstName"),
      nonEmptyString("lastName"),
      nonEmptyString("phone"),
      validBoolean("smsConsent"),
      nonEmptyString("zip"),
      validInteger("age"),
      nonEmptyString("gender"),
      validArray("eventSources", validInteger),
      validArray("leadServices", validInteger)
    );

    if (validityErrors.length > 0) {
      return invalidRequest(res, validityErrors);
    }
  }

  let leadQuery = "";
  const leadDataArray = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];

    const addToLeadQuery =
      "INSERT INTO leads (dateOfSignUp, firstName, lastName, phone, smsConsent, zip, age, gender, addedBy, modifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const setLeadId = "SET @leadId = LAST_INSERT_ID()";

    leadDataArray.push(
      lead.dateOfSignUp,
      lead.firstName,
      lead.lastName,
      lead.phone,
      lead.smsConsent,
      lead.zip,
      lead.age,
      lead.gender,
      user.id,
      user.id
    );

    const leadServices = lead.leadServices;
    let leadServicesQuery = "";

    if (leadServices.length > 0) {
      leadServicesQuery =
        "INSERT INTO leadServices (leadId, serviceId) VALUES (@leadId, ?)";

      leadDataArray.push(leadServices[0]);

      if (leadServices.length > 1) {
        for (let j = 1; j < leadServices.length; j++) {
          const serviceId = leadServices[j];
          leadServicesQuery = leadServicesQuery + ", (@leadId, ?)";
          leadDataArray.push(serviceId);
        }
      }
    }

    const leadEvents = lead.eventSources;
    let leadEventsQuery = "";

    if (leadEvents > 0) {
      leadEventsQuery =
        "INSERT INTO leadEvents (leadId, eventId) VALUES (@leadId, ?)";

      leadDataArray.push(leadEvents[0]);

      if (leadEvents.length > 1) {
        for (let j = 1; j < leadEvents.length; j++) {
          const eventId = leadEvents[j];
          leadEventsQuery = leadEventsQuery + ", (@leadId, ?)";
          leadDataArray.push(eventId);
        }
      }
    }

    const newLeadQuery = `${addToLeadQuery}; ${setLeadId}; ${leadServicesQuery}; ${leadEventsQuery};`;
    leadQuery = `${leadQuery} ${newLeadQuery}`;
  }

  let newLeadsData = mysql.format(leadQuery, leadDataArray);

  pool.query(newLeadsData, (err, result) => {
    if (err) {
      return databaseError(req, res, err);
    }

    const leadIds = result.map(data => data.insertId).joint(", ");

    res.json({ message: `Created leads ${leadIds}.` });
  });
});
