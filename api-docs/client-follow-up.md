# Client follow up note

The client follow up documents and updates any calls with the client and documents the interaction as well as set up a date to follow up with the client.

## Creating a follow up note on a client

### Request

```http
POST /api/clients/:clientId/follow-up
```

```json
{
  "serviceId": 13,
  "title": "COVID test follow up",
  "description": "Client got tested and we will follow up with them for results",
  "dateOfCall": "2020-07-28",
  "followUpDate": "2020-08-12"
}
```

### Response

```json
{
  "serviceId": 13,
  "title": "Test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "dateOfCall": "2020-07-28",
  "followUpDate": "2020-08-12",
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
    "timestamp": "2020-07-28T06:00:00:000Z"
  }
}
```

## Modify a follow up note

### Request

```http
PATCH /api/clients/:clientId/follow-up/:followUpId
```

```json
{
  "serviceId": 12,
  "title": "COVID test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "dateOfCall": "2020-07-28",
  "followUpDate": "2020-08-15"
}
```

### Response

```json
{
  "serviceId": 12,
  "title": "COVID test follow up",
  "description": "Client got tested for COVID and we will follow up with them for results",
  "dateOfCall": "2020-07-28",
  "followUpDate": "2020-08-15",
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
