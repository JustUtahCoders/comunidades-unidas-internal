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
      addedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
      userId
    ]
  );
};
