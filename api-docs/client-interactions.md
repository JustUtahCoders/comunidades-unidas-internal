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
  "title": "SNAP",
  "subtitle": "Nutrition Program",
  "interactionType": "walk-in",
  "referral": false,
  "establishedGoal": null,
  "notes": "Application successfully filled out. Decision pending.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "location": "CU Office",
  "referenceServices": ["Citizenship", "Financial Coach"],
  "followUp": {
    "requested": true,
    "preferredTime": "morning",
    "preferredDay": ["Monday", "Wednesday"],
    "contactMethod": "call"
  },
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
      "program": {
        "title": "SNAP",
        "subtitle": "Nutrition Program"
      },
      "interactionType": "by phone",
      "notes": "Application successfully filled out. Decision pending.",
      "startTime": "2019-05-06T05:00:00.000Z",
      "endTime": "2019-05-06T06:00:00.000Z",
      "location": null,
      "referenceServices": ["Supermarket Visit"],
      "followUp": {
        "requested": true,
        "reason": "Would like to discussion their options if denied.",
        "preferredDay": ["Monday", "Wednesday"],
        "preferredTime": "morning",
        "contactMethod": "call"
      },
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
      "program": {
        "title": "Financial Counseling",
        "subtitle": "Financial Coach Referal",
        "referral": true,
        "establishedGoal": "Save $1000"
      },
      "interactionType": "in person",
      "notes": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
      "startTime": "2019-05-06T05:00:00.000Z",
      "endTime": "2019-05-06T06:00:00.000Z",
      "location": "CU Office",
      "referenceServices": ["DACA", "Youth Group"],
      "followUp": {
        "requested": false,
        "reason": null,
        "preferredDay": null,
        "preferredTime": null,
        "contactMethod": null
      },
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
  "program": {
    "title": "Financial Counseling",
    "subtitle": "Financial Coach Referal",
    "referral": true,
    "establishedGoal": "Save $1000"
  },
  "interactionType": "in person",
  "notes": "Appointment setup with financial coach. Client would like to save up enough for a down payment on a car better suited for their work.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "location": "CU Office",
  "referenceServices": ["DACA", "Youth Group"],
  "followUp": {
    "requested": true,
    "reason": "Would like to discuss additional financial coaching resources specific to small business owners.",
    "preferredDay": ["Monday", "Wednesday"],
    "preferredTime": "morning",
    "contactMethod": "call"
  },
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

- `program` is an enum with the following possible object values:

  ```json
  [
    {
      "title": "Preventive Health",
      "subtitle": [
        "VDS daily services",
        "VDS mobile",
        "VDS Sabath",
        "Mobile Health Services",
        "Other"
      ]
    },
    {
      "title": "Nutrition",
      "subtitle": ["Nutrition", "Supermarket visit", "Cooking class", "SNAP"]
    },
    {
      "title": "Immigration",
      "subtitle": ["Citizenship", "Family Petition", "DACA", "Other"]
    },
    {
      "title": "Financial Counseling",
      "referral": false,
      "establishedGoal": null
    },
    {
      "title": "Worker Rights"
    },
    {
      "title": "Youth Group"
    },
    {
      "title": "Community Organization",
      "subtitle": ["Volunteering", "Promoter", "Internship"]
    },
    {
      "title": "Family Support Services",
      "subtitle": [
        "LDS Vouchers",
        "Faxes",
        "References outside of CU",
        "Other"
      ],
      "outsideReferences": null,
      "other": null
    }
  ]
  ```

- `program.outsideReferences` will be `null` if the `program.subtitle` "References outside of CU" has not been selected

- `program.other` will be `null` if the `program.subtitle` "Other" is not selected.

- `interactionType` is an enum with the possible values of `in person`, `by phone`, `workshop/talk`, `one on one/light touch`, `consultation`

- `referenceServices` is an enum with the possible values of `citizenship`, `family petition`, `workers' rights/safety`, `DACA`, `youth group`, `promoters/leadership classes`, `SNAP/food stamps`, `evidence of chronic diseases`, `nutrition`, `supermarket visit`, `food demonstartion`, `community organization/advocacy`, `financial education/advising`, `financial coach`, `family support services`, `outside referral`, or `other`

- If `followUp.requested` is false `followUp.reason`, `followUp.preferredDay`, `followUp.preferredTime`, `followUp.contactMethod` will be `null`.

- `followUp.preferredDay` is an enum with the possible values of `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, and `Sunday`

- `followUp.prefferredTime` is an enum with the possible values of `morning`, `afternoon`, or `evening`

- `followUp.contactMethod` is an enum with the possible values of `call`, `text`, or `email`

### Response

The response object is exactly the same as the response object inside of the client log.

## Modify a Client Interaction

### Request

```http
PATCH /api/clients/:id/interactions/:id
```

```json
{
  "program": {
    "title": "SNAP",
    "subtitle": "Nutrition Program"
  },
  "interactionType": "by phone",
  "notes": "Application successfully filled out. Decision pending.",
  "startTime": "2019-05-06T05:00:00.000Z",
  "endTime": "2019-05-06T06:00:00.000Z",
  "followUp": {
    "requested": true,
    "reason": "Would like to discussion their options if denied.",
    "preferredDay": ["Monday", "Wednesday"],
    "preferredTime": "morning",
    "contactMethod": "call"
  },
  "location": null,
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

**_Note_**

- You can omit properties that you do not want to update.

### Response

The response to updating the information is the same as the response for `GET /api/clients/:id/interactions/:id`

## Delete a Client Interaction

### Request

```http
PATCH /api/clients/:id/interactions/:id/delete
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
