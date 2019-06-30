const mysql = require("mysql");

exports.insertActivityLogQuery = function(params) {
  if (params.detailIdIsLastInsertId) {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID());
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy
      ]
    );
  } else {
    return mysql.format(
      `
      INSERT INTO clientLogs (clientId, title, description, logType, addedBy, detailId)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
      [
        params.clientId,
        params.title,
        params.description,
        params.logType,
        params.addedBy,
        params.detailId
      ]
    );
  }
};
