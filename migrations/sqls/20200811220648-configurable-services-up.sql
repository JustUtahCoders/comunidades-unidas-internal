ALTER TABLE services
  ADD COLUMN defaultLineItemName TEXT,
  ADD COLUMN defaultLineItemDescription TEXT,
  ADD COLUMN defaultLineItemRate DECIMAL(15, 2),
  ADD COLUMN defaultInteractionLocation enum('CUOffice', 'consulateOffice', 'communityEvent'),
  ADD COLUMN defaultInteractionType enum('inPerson', 'byPhone', 'workshopTalk', 'oneOnOneLightTouch', 'consultation'),
  ADD COLUMN defaultInteractionDuration TIME
;