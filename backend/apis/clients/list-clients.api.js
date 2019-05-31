const { app, databaseError, pool, invalidRequest } = require("../../server");
const mysql = require("mysql");

app.get("/api/clients", (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return databaseError(req, res, err);
    }

    var queryString =
      "SELECT cl.id,cl.firstName,cl.lastName,cl.birthday,ct.zip,ct.primaryPhone,cl.addedBy as addedById,us.firstName as addedByFirstName,us.lastname as addedByLastName,cl.dateAdded FROM clients cl JOIN contactInformation ct ON cl.id = ct.clientId JOIN users us ON cl.addedBy = us.Id WHERE (cl.firstName LIKE ? AND cl.lastName LIKE ?) OR ct.zip = ? ORDER BY cl.firstName,cl.lastName DESC LIMIT 100";
    if (req.query.page) {
      queryString += "," + parseInt(req.query.page) * 100;
    }
    const getClientList = mysql.format(queryString, [
      req.query.firstName + "%",
      req.query.lastName + "%",
      req.query.zip
    ]);

    connection.query(getClientList, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send({
        numClients: rows.length,
        clients: rows.map(row => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          birthday: row.birthday,
          zip: row.zip,
          primaryPhone: row.primaryPhone,
          addedBy: {
            addedById: row.addedById,
            addedByFirstName: row.addedByFirstName,
            addedByLastName: row.addedByLastName
          },
          dateAdded: row.dateAdded
        }))
      });
    });
  });
});
