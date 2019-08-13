# Client Interactions

The client interactions document direct encounters with the clients.

Here is the list of the valid interaction types:

- `clientInteractionCreated`,
- `clientInteractionUpdated`,
- `clientInteractionDeleted`,

## Get a single Client Interaction

### Request

```http
GET /api/clients/:id/interactions/:id
```

### Response

```json
{
  "id": 1,
  "title": "Nutrition Program - SNAP",
  "serviceId": 7,
  "interactionType": "walkIn",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "canModify": true,
  "isDeleted": false,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
}
```

## Get all of a single Client's Interactions

### Request

```http
GET /api/clients/:id/interactions/
```

### Response

```json
{
  "interactions": [
    {
      "id": 1,
      "title": "Nutrition Program - SNAP",
      "serviceId": 7,
      "interactionType": "byPhone",
      "description": "Application successfully filled out. Decision pending.",
      "dateOfInteraction": "2019-05-06",
      "duration": "1:00:00",
      "location": null,
      "canModify": true,
      "isDeleted": false,
      "createdBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      },
      "lastUpdatedBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      },
    },
    {
      "id": 2,
      "title": "Financial Counseling - Financial Coach Referal",
      "serviceId": 13,
      "interactionType": "inPerson",
      "description": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
      "dateofInteraction": "2019-05-06",
      "duration": "1:00:00",
      "location": "CUOffice",
      "canModify": true,
      "isDeleted": false,
      "createdBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      },
      "lastUpdatedBy": {
        "userId": 1,
        "firstName": "Joel",
        "lastName": "Denning",
        "fullName": "Joel Denning",
        "timestamp": "2019-05-06T06:00:00.000Z"
      },
    }
  ]
}
```

## Create a Client Interaction

### Request

```http
POST /api/clients/:id/interactions
```

```json
{
  "title": "Financial Counseling - Financial Coach Referal",
  "serviceId": 13,
  "interactionType": "inPerson",
  "description": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "canModify": true,
  "isDeleted": false,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
}
```

**_Notes_**

- `serviceId` list can be found `GET /api/services` and more information can be found on the CU Services database can be found in `api-docs/list-services.md`
- `interactionType` is an enum with the possible values of `inPerson`, `byPhone`, `workshopTalk`, `oneOnOneLightTouch`, `consultation`
- `location` is an enum with the possible values of `CUOffice`, `consulate`, and `communityEvent`

### Response

```json
{
  "id": 1,
  "title": "Nutrition Program - SNAP",
  "serviceId": 7,
  "interactionType": "walkIn",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "canModify": true,
  "isDeleted": false,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
}
```

## Modify a Client Interaction

### Request

```http
PATCH /api/clients/:id/interactions/:id
```

```json
{
  "title": "SNAP - Nutrition Program",
  "serviceId": 7,
  "interactionType": "byPhone",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": null,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
}
```

**_Note_**

- You can omit properties that you do not want to update.
- The "canModify" and "isDeleted" properties cannot be modified.

### Response

The response to updating the information is the same as the response for `GET /api/clients/:id/interactions/:id`

## Delete a Client Interaction

### Request

```http
DELETE /api/clients/:id/interactions/:id
```

```json
{
  "isDeleted": true
}
```

**_Note_**

- No attribute other than `isDeleted` should be updated.
- `isDeleted` should be `true` to be deleted.

### Response

An HTTP 204 status is returned if the deletion was successful.

An HTTP 400 status is returned if you cannot delete this event.
