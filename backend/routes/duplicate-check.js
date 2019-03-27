module.exports = {
  duplicateCheck: (res, req) => {
    let query = mysql.format(
      "SELECT personid,firsname,lastname,dob FROM person WHERE firsname = ? AND lastname = ? ",
      [req.body.firstname, req.body.firstname]
    );
    connection.query(query, function(err, rows, fields) {
      if (err) {
        return databaseError(req, res, err);
      }
      res.send(rows[0]);
    });
  }
};
