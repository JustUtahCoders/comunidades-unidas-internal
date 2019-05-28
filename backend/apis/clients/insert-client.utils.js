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
