# Client activity log

The client activity log shows the history of everything that has happened with the client.
A log entry includes a timestamp, title, optional description, "log type", optional
"detailId", "canDelete", and "is deleted" flag.

Here is the list of valid log types:

- `clientCreated`,
- `clientUpdated:basicInformation`,
- `clientUpdated:contactInformation`,
- `clientUpdated:demographics`,
- `clientUpdated:intakeData`,
- `caseNote`,

The `detailId` refers to an id for a different resource that you may request if you
want additional information about this log entry.

Entries in the activity log may not be modified. Some entries may be soft-deleted,
but will still show in the activity log as collapsed entries.

## Get activity log

### Request

```http
GET /api/clients/:id/logs
```

### Response

```json
{
  "logs": [
    {
      "id": 1,
      "title": "Client was created",
      "logType": "clientCreated",
      "canDelete": false,
      "isDeleted": false,
      "createdBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      }
    },
    {
      "id": 2,
      "title": "Notes about first visit",
      "description": "<div>Some rich text</div>",
      "logType": "caseNote",
      "canDelete": true,
      "isDeleted": false,
      "createdBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      }
    }
  ]
}
```

## Adding entries to the client log

Many APIs will automatically populate the client activity log without you
having to do anything extra.

Here are the log types that you can add manually:

### Add a case note

#### Request

```http
POST /api/clients/:id/logs
```

```json
{
  "logType": "caseNote",
  "title": "Hello",
  "description": "<div>Some rich text</div>"
}
```

#### Response

The response object is exactly the same as the response object inside of the client log.

## Delete a log event

### Request

```http
DELETE /api/clients/:id/notes
```
