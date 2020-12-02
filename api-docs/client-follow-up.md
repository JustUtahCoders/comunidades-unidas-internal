# Client follow ups

The client follow up documents and updates any calls with the client and documents the interaction as well as set up a date to follow up with the client.

## Creating a follow up note on a client

**_Notes_**

A client follow up must include an array of associated service id(s), title of the interaction, the description of the interaction, and a date to follow up with the client.

### Request

```http
POST /api/clients/:clientId/follow-ups
```

```json
{
  "serviceIds": [12, 13],
  "title": "COVID test follow up",
  "description": "Client got tested and we will follow up with them for results",
  "duration": "1:00:00",
  "dateOfContact": "2020-07-28",
  "appointmentDate": "2020-08-12"
}
```

### Response

```json
{
  "id": 1,
  "serviceIds": [12, 13],
  "title": "Test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "dateOfContact": "2020-07-28",
  "duration": "1:00:00",
  "appointmentDate": "2020-08-12",
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2020-07-28T06:00:00:000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2020-07-28T06:00:00:000Z"
  }
}
```

## Modify a follow up note

### Request

```http
PATCH /api/clients/:clientId/follow-ups/:followUpId
```

```json
{
  "serviceIds": 12,
  "title": "COVID test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "duration": "1:30:00",
  "dateOfContact": "2020-07-28",
  "appointmentDate": "2020-08-15"
}
```

### Response

```json
{
  "id": 1,
  "serviceIds": 12,
  "title": "COVID test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "duration": "1:30:00",
  "dateOfContact": "2020-07-28",
  "appointmentDate": "2020-08-15",
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2020-07-28T06:00:00:000Z"
  },
  "lastUpdateBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2020-08-01T06:00:00:000Z"
  }
}
```
