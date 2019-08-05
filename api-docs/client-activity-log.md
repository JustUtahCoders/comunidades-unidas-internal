# Client activity log

The client activity log shows the history of everything that has happened with the client.
A log entry includes a timestamp, title, optional description, "log type", optional
detailId, canModify, and isDeleted flag.

Here is the list of valid log types:

- `clientCreated`,
- `clientUpdated:basicInformation`,
- `clientUpdated:contactInformation`,
- `clientUpdated:demographics`,
- `clientUpdated:intakeData`,
- `caseNote`,

The `detailId` refers to an id for a different resource that you may request if you
want additional information about this log entry.

Only some of the entries in the activity log may be modified and deleted. Here are
the log types that can be modified/deleted:

- `caseNote`

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
      "description": null,
      "logType": "clientCreated",
      "canModify": false,
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
      "canModify": true,
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
DELETE /api/clients/:clientId/logs/logId
```

```json
{
  "isDeleted": true
}
```

### Response

An HTTP 204 status is returned if the deletion was successful.

An HTTP 400 status is returned if you cannot delete this event.
