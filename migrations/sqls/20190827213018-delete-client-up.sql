ALTER TABLE clients
    ADD COLUMN
        isDeleted BOOLEAN NOT NULL DEFAULT FALSE;

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
            'clientInteraction:serviceProvided'
        ) NOT NULL;   