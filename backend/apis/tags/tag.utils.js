const mariadb = require("mariadb/callback.js");

exports.validTagsList = ["immigration"];

exports.insertTagsQuery = function insertTags(foreignId, foreignTable, tags) {
  tags = sanitizeTags(tags);

  if (tags.length === 0) {
    return "";
  } else {
    return tags
      .map((tag) =>
        mariadb.format(
          `
      INSERT IGNORE INTO tags (foreignId, foreignTable, tag) VALUES (${
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

exports.sanitizeTags = sanitizeTags;

function sanitizeTags(tags) {
  if (typeof tags === "string") {
    return [tags];
  } else if (Array.isArray(tags)) {
    return tags;
  } else {
    return [];
  }
}
