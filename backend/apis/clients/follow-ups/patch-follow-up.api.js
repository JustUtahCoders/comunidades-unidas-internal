const { app, databaseError, pool, invalidRequest } = require("../../../server");
const mysql = require("mysql");
const {
  checkValid,
  validId,
  validDate,
  validTime,
  validArray,
  validDateTime,
  nullableValidDateTime,
} = require("../../utils/validation-utils");
const fs = require("fs");
const path = require("path");
