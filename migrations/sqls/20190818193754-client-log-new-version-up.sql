ALTER TABLE clientLogs
  ADD COLUMN idOfUpdatedLog INT NULL,
  ADD FOREIGN KEY updatedLogFk(idOfUpdatedLog) REFERENCES clientLogs(id);