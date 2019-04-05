const { app, databaseError, pool } = require("../server");
const mysql = require("mysql");

app.post("/api/add-client/", (req, res, next) => {
  pool.getConnection((err, connection) => {
    var body = req.body.clientState;
    var personQry =
      "INSERT INTO person(firstName,lastName,dob,gender,addedBy,modifiedBy) VALUES(?,?,?,?,1,1)";
    var personInserts = [
      body.firstName,
      body.lastName,
      body.birthday,
      body.gender
    ];
    var contactQry =
      "INSERT INTO contact(personId,primaryPhone,textMessages,email,address,owned,city,zip,state,addedby) VALUES(?,?,?,?,?,?,?,?,?,1);";
    var demoQry =
      "INSERT INTO demographics(personId,originCountry,languageHome,englishProficiency,dateUSArrival,employed,employmentSector,payInterval,weeklyAvgHoursWorked,householdSize,dependents,maritalStatus,householdIncome,addedby) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1);";
    var qry = mysql.format(personQry, personInserts);
    connection.beginTransaction(function(err) {
      if (err) {
        throw err;
      }
      connection.query(qry, function(error, results, fields) {
        if (error) {
          return connection.rollback(function() {
            throw error;
          });
        }
        var personId = results.insertId;
        var contactInserts = [
          personId,
          body.phone,
          body.smsConsent,
          body.email,
          body.streetAddress,
          body.owned,
          body.city,
          body.zip,
          body.state
        ];

        qry = mysql.format(contactQry, contactInserts);
        connection.query(qry, function(error, results, fields) {
          if (error) {
            return connection.rollback(function() {
              throw error;
            });
          }
          var demoInserts = [
            personId,
            body.countryOfOrigin,
            body.primaryLanguage,
            body.englishLevel,
            body.dateUSArrival,
            body.currentlyEmployed,
            body.employmentSector,
            body.payInterval,
            body.hoursWorked,
            body.houseHoldSize,
            body.dependents,
            body.civilStatus,
            body.annualIncome
          ];
          qry = mysql.format(demoQry, demoInserts);
          connection.query(qry, function(error, results, fields) {
            if (error) {
              return connection.rollback(function() {
                throw error;
              });
            }
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  throw err;
                });
              }
              res.send(results);
            });
          });
        });
      });
    });
  });
});
