ALTER TABLE clientLogs
    MODIFY COLUMN
        logType enum (
            'clientCreated',
            'clientUpdated:basicInformation',
            'clientUpdated:contactInformation',
            'clientUpdated:demographics',
            'clientUpdated:intakeData',
            'clientDeleted',
            'caseNote',
            'clientInteraction:created',
            'clientInteraction:updated',
            'clientInteraction:deleted',
            'clientInteraction:serviceProvided',
            'integration:enabled',
            'integration:disabled',
            'integration:broken',
            'integration:sync'
        ) NOT NULL;   
