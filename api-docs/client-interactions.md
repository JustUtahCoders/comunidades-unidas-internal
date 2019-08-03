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
  "interactionType": "walk-in",
  "description": "Application successfully filled out. Decision pending.",
  "date": "2019-05-06T05:00:00.000Z",
  "duraction": "1:00:00",
  "location": "CU Office",
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
      "interactionType": "by phone",
      "notes": "Application successfully filled out. Decision pending.",
      "startTime": "2019-05-06T05:00:00.000Z",
      "endTime": "2019-05-06T06:00:00.000Z",
      "location": null,
      "referenceServices": ["Supermarket Visit"],
      "canModify": true,
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
      "title": "Financial Counseling - Financial Coach Referal",
      "interactionType": "in person",
      "notes": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
      "startTime": "2019-05-06T05:00:00.000Z",
      "endTime": "2019-05-06T06:00:00.000Z",
      "location": "CU Office",
      "referenceServices": ["DACA", "Youth Group"],
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

## Create a Client Interaction

### Request

```http
POST /api/clients/:id/interactions
```

```json
{
  "title": "Financial Counseling - Financial Coach Referal",
  "interactionType": "in person",
  "notes": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "location": "CU Office",
  "referenceServices": ["DACA", "Youth Group"],
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
```

**_Notes_**

- `program` is an enum with the following possible string values `Preventive Health - VDS daily services`, `Preventive Health - VDS mobile`, `Preventive Health - VDS Sabath`, `Preventive Health - Mobile Health Services`, `Preventive Health - Other`, `Nutrition - Nutrition`, `Nutrition - Supermarket visit`, `Nutrition - Cooking class`, `Nutrition - SNAP`, `Immigration - Citizenship`, `Immigration - Family Petition`, `Immigration - DACA`, `Immigration - Other`, `Financial Counseling`, `Worker Rights`, `Youth Group`, `Community Organization - Volunteering`, `Community Organization - Promoter`, `Community Organization - Internship`, `Family Support Services - LDS Vouchers`, `Family Support Services - Faxes`, `Family Support Services - References outside of CU`, `Family Support Services - Other`

- `interactionType` is an enum with the possible values of `in person`, `by phone`, `workshop/talk`, `one on one/light touch`, `consultation`

- `referenceServices` is an enum with the possible values of `citizenship`, `family petition`, `workers' rights/safety`, `DACA`, `youth group`, `promoters/leadership classes`, `SNAP/food stamps`, `evidence of chronic diseases`, `nutrition`, `supermarket visit`, `food demonstartion`, `community organization/advocacy`, `financial education/advising`, `financial coach`, `family support services`, `outside referral`, or `other`

### Response

```json
{
  "id": 1,
  "title": "Nutrition Program - SNAP",
  "interactionType": "walk-in",
  "description": "Application successfully filled out. Decision pending.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "location": "CU Office",
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
```

## Modify a Client Interaction

### Request

```http
PATCH /api/clients/:id/interactions/:id
```

```json
{
  "title": "SNAP - Nutrition Program",
  "interactionType": "by phone",
  "notes": "Application successfully filled out. Decision pending.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "location": null,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  }
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
