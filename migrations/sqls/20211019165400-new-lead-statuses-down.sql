ALTER TABLE leads
  MODIFY leadStatus ENUM("active", "inactive", "convertedToClient")
;