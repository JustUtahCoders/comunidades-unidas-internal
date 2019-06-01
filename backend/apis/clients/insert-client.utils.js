const mysql = require("mysql");
const { requestEnum, requestPhone } = require("../utils/transform-utils");

exports.insertContactInformationQuery = function insertContactInformationQuery(
  clientId,
  data,
  userId
) {
  return mysql.format(
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
      userId
    ]
  );
};

exports.insertDemographicsInformationQuery = function insertDemographicsInformationQuery(
  clientId,
  data,
  userId
) {
  return mysql.format(
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
      data.countryOfOrigin.toUpperCase(),
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
      Boolean(data.eligibleToVote),
      Boolean(data.registeredToVote),
      Boolean(data.isStudent),
      userId
    ]
  );
};

exports.insertIntakeDataQuery = function insertIntakeDataQuery(
  clientId,
  data,
  userId
) {
  return mysql.format(
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
      userId
    ]
  );
};

exports.insertIntakeServicesQuery = function insertIntakeServicesQuery(data) {
  return mysql.format(
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
  );
};
