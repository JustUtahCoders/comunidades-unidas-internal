ALTER TABLE clientInteractionCustomAnswers
ADD COLUMN interactionId INT NOT NULL,
ADD CONSTRAINT fk_interaction_id FOREIGN KEY (interactionId) REFERENCES clientInteractions(id)
;