# Client Interactions

The client interactions document direct encounters with the clients.

Here is the list of the valid interaction types:

- `clientInteractionCreated`,
- `clientInteractionUpdated`,
- `clientInteractionDeleted`,

## Get a single Client Interaction

### Request

```http
GET /api/clients/:id/interactions/:id?tags=immigration
```

### Response

```json
{
  "id": 1,
  "serviceId": 7,
  "interactionType": "inPerson",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "isDeleted": false,
  "redacted": false,
  "customQuestions": [
    {
      "questionId": 123,
      "answer": 6
    }
  ],
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
  }
}
```

### Notes

The `tags` query parameter controls whether information is redacted or not.

## Create a Client Interaction

### Request

```http
POST /api/clients/:id/interactions?tags=immigration
```

```json
{
  "serviceId": 13,
  "interactionType": "inPerson",
  "description": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "customQuestions": [
    {
      "questionId": 123,
      "answer": 6
    }
  ]
}
```

**_Notes_**

- `serviceId` list can be found `GET /api/services` and more information can be found on the CU Services database can be found in `api-docs/list-services.md`
- `interactionType` is an enum with the possible values of `inPerson`, `byPhone`, `workshopTalk`, `oneOnOneLightTouch`, `consultation`
- `location` is an enum with the possible values of `CUOffice`, `consulate`, and `communityEvent`
- `tags` controls which tags are applied to the interaction. Immigration tags control whether information is redacted or not.

### Response

```json
{
  "id": 1,
  "serviceId": 7,
  "interactionType": "byPhone",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": "CUOffice",
  "isDeleted": false,
  "redacted": false,
  "customQuestions": [
    {
      "questionId": 123,
      "answer": 6
    }
  ],
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
  }
}
```

## Modify a Client Interaction

### Request

```http
PATCH /api/clients/:id/interactions/:id
```

```json
{
  "serviceId": 7,
  "interactionType": "byPhone",
  "description": "Application successfully filled out. Decision pending.",
  "dateOfInteraction": "2019-05-06",
  "duration": "1:00:00",
  "location": null,
  "customQuestions": [
    {
      "questionId": 123,
      "answer": 6
    }
  ]
}
```

**_Note_**

- You can omit properties that you do not want to update.
- The "isDeleted" property cannot be modified.

### Response

The response to updating the information is the same as the response for `GET /api/clients/:id/interactions/:id`

## Delete a Client Interaction

### Request

```http
DELETE /api/clients/:id/interactions/:id
```

### Response

An HTTP 204 status is returned if the deletion was successful.

An HTTP 400 status is returned if you cannot delete this event.
