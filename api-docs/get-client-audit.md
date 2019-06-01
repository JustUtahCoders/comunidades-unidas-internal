# Get client audit

The get client audit endpoint lets you see how many times each part of the client has been updated,
who performed the last update, and when was the last update.

## Request

```http
GET /api/clients/:id/audits
```

## Response

```json
{
  "auditSummary": {
    "client": {
      "lastUpdate": {
        "fullName": "Freddy Mercury",
        "firstName": "Freddy",
        "lastName": "Mercury",
        "timestamp": "2019-05-31T11:09:24.000Z"
      }
    },
    "contactInformation": {
      "numWrites": 3,
      "lastUpdate": {
        "userId": 1,
        "fullName": "Freddy Mercury",
        "firstName": "Freddy",
        "lastName": "Mercury",
        "timestamp": "2019-05-31T11:09:24.000Z"
      }
    },
    "demographics": {
      "numWrites": 5,
      "lastUpdate": {
        "userId": 1,
        "fullName": "Freddy Mercury",
        "firstName": "Freddy",
        "lastName": "Mercury",
        "timestamp": "2019-05-31T11:09:24.000Z"
      }
    },
    "intakeData": {
      "numWrites": 1,
      "lastUpdate": {
        "userId": 1,
        "fullName": "Freddy Mercury",
        "firstName": "Freddy",
        "lastName": "Mercury",
        "timestamp": "2019-05-31T11:09:24.000Z"
      }
    }
  }
}
```
