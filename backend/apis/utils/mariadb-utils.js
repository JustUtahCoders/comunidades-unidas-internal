const { pool, databaseError } = require("../../server");

exports.mariadbArrToJs = function mariadbArrToJs(mariadbArr) {
  if (mariadbArr === null) {
    return [];
  } else if (typeof mariadbArr === "string") {
    return JSON.parse(mariadbArr);
  } else if (Array.isArray(mariadbArr)) {
    return mariadbArr;
  } else {
    console.error(mariadbArr);
    throw Error(`Unknown mariadbArr type ${typeof mariadbArr}`);
  }
};

exports.runQueriesArray = function runQueriesArray(queries, errBack) {
  let index = 0,
    results = [];

  pool.getConnection((err, connection) => {
    if (err) {
      errBack(err);
    }

    runQuery();

    function runQuery() {
      if (index === queries.length - 1) {
        connection.commit();
        connection.release();
        errBack(null, results);
      } else {
        connection.query(queries[index++], (err, result) => {
          if (err) {
            errBack(err, result);
          } else {
            results.push(result);
            runQuery();
          }
        });
      }
    }
  });
};
