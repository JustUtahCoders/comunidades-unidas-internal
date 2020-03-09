ALTER TABLE bulkSms
  ADD COLUMN clientRecipients INT NULL,
  ADD COLUMN leadRecipients INT NULL,
  ADD COLUMN query VARCHAR(2048);