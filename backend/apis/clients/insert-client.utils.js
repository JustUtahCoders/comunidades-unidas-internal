const mariadb = require("mariadb/callback.js");
const { requestEnum, requestPhone } = require("../utils/transform-utils");
const { insertActivityLogQuery } = require("./client-logs/activity-log.utils");

exports.insertContactInformationQuery = function insertContactInformationQuery(
  clientId,
  data,
  userId,
  insertLogEntry = false
) {
  const result = [
    mariadb.format(
      `
    INSERT INTO contactInformation (
      clientId,
      primaryPhone,
      textMessages,
      email,
      address,
      city,
      state,
      zip,
      housingStatus,
      addedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
      [
        clientId,
        requestPhone(data.phone),
        data.smsConsent,
        data.email,
        data.homeAddress.street,
        data.homeAddress.city,
        data.homeAddress.state,
        data.homeAddress.zip,
        requestEnum(data.housingStatus),
        userId,
      ]
    ),
  ];

  if (insertLogEntry) {
    result.push(
      insertActivityLogQuery({
        clientId,
        title: "Contact information was updated",
        description: null,
        logType: "clientUpdated:contactInformation",
        addedBy: userId,
        detailIdIsLastInsertId: true,
      })
    );
  }

  return result;
};

exports.insertDemographicsInformationQuery = function insertDemographicsInformationQuery(
  clientId,
  data,
  userId,
  insertLogEntry = false
) {
  const result = [
    mariadb.format(
      `
    INSERT INTO demographics (
      clientId,
      countryOfOrigin,
      homeLanguage,
      englishProficiency,
      dateOfUSArrival,
      employed,
      employmentSector,
      payInterval,
      weeklyAvgHoursWorked,
      householdSize,
      dependents,
      civilStatus,
      householdIncome,
      registerToVote,
      registeredVoter,
      isStudent,
      addedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
      [
        clientId,
        data.countryOfOrigin ? data.countryOfOrigin.toUpperCase() : null,
        requestEnum(data.homeLanguage),
        data.englishProficiency,
        data.dateOfUSArrival,
        requestEnum(data.currentlyEmployed),
        data.employmentSector,
        data.payInterval,
        data.weeklyEmployedHours,
        data.householdSize,
        data.dependents,
        data.civilStatus,
        data.householdIncome,
        data.eligibleToVote,
        data.registeredToVote,
        data.isStudent,
        userId,
      ]
    ),
  ];

  if (insertLogEntry) {
    result.push(
      insertActivityLogQuery({
        clientId,
        title: "Demographics information was updated",
        description: null,
        logType: "clientUpdated:demographics",
        addedBy: userId,
        detailIdIsLastInsertId: true,
      })
    );
  }

  return result;
};

exports.insertIntakeDataQuery = function insertIntakeDataQuery(
  clientId,
  data,
  userId
) {
  return mariadb.format(
    `
    INSERT INTO intakeData (
      clientId,
      dateOfIntake,
      clientSource,
      couldVolunteer,
      addedBy
    ) VALUES (?, ?, ?, ?, ?);
  `,
    [
      clientId,
      data.dateOfIntake,
      requestEnum(data.clientSource),
      Boolean(data.couldVolunteer),
      userId,
    ]
  );
};

exports.insertIntakeServicesQuery = function insertIntakeServicesQuery(
  data,
  insertLogEntry = false
) {
  const result = [
    mariadb.format(
      `
      SET @intakeDataId = LAST_INSERT_ID();

      ${data.intakeServices
        .map(
          () =>
            "INSERT INTO intakeServices (intakeDataId, serviceId) VALUES (@intakeDataId, ?);\n"
        )
        .join("")}
    `,
      data.intakeServices
    ),
  ];

  if (insertLogEntry) {
    result.push(
      ...insertActivityLogQuery({
        clientId: data.clientId,
        title: "Intake data was updated",
        description: null,
        logType: "clientUpdated:intakeData",
        addedBy: data.userId,
        detailId: { rawValue: "@intakeDataId" },
      })
    );
  }

  return result;
};

exports.convertLeadToClient = function (leadId, clientId, userId) {
  return mariadb.format(
    "UPDATE leads SET leadStatus = ?, clientId = ?, modifiedBy = ? WHERE leads.id = ?;",
    ["convertedToClient", clientId, userId, leadId]
  );
};
