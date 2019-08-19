ALTER TABLE clientLogs
    MODIFY COLUMN
        logType enum (
            'clientCreated',
            'clientUpdated:basicInformation',
            'clientUpdated:contactInformation',
            'clientUpdated:demographics',
            'clientUpdated:intakeData',
            'caseNote',
            'clientInteraction:created',
            'clientInteraction:updated',
            'clientInteraction:deleted'
        ) NOT NULL;   
