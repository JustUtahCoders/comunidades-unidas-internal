const mysql = require("mysql");

exports.validTagsList = ["immigration"];

exports.insertTagsQuery = function insertTags(foreignId, foreignTable, tags) {
  if (typeof tags === "string") {
    tags = [tags];
  }

  if (tags.length === 0) {
    return "";
  } else {
    return tags
      .map((tag) =>
        mysql.format(
          `
      INSERT INTO tags (foreignId, foreignTable, tag) VALUES (${
        foreignId.rawValue || "?"
      }, ?, ?);
    `,
          [foreignId.rawValue ? false : foreignId, foreignTable, tag].filter(
            Boolean
          )
        )
      )
      .join("\n");
  }
};

exports.sanitizeTags = function sanitizeTags(tags) {
  if (typeof tags === "string") {
    return [tags];
  } else if (Array.isArray(tags)) {
    return tags;
  } else {
    return [];
  }
};
