# Leads

The leads will document potiental clients sourced from CU events.

## Get a single Lead

### Request

```http
GET /api/leads/:id
```

### Response

```json
{
  "id": 1,
  "dateOfSignUp": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSources": [
    {
      "eventId": 1,
      "eventName": "Health Fair",
      "eventLocation": "Saint Marks",
      "eventDate": "2019-10-10"
    }
  ],
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "leadServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "programName": "Immigration"
    }
  ],
  "clientId": 1,
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
  }
}
```

**_Notes_**

- `leadStatus` is an enum with the possible values of `active`, `inactive`, and `convertedToClient`.
- `inactivityReason` is an enum with the possible values of `doNotCallRequest`, `threeAttemptsNoResponse`, `wrongNumber`, `noLongerInterested`, and `relocated`.
- `eventSources` is an array of integer event ids
- `gender` is an enum with possible values of `female`, `male`, `transgender`, `nonbinary`, `other`.
- `leadServices` is an array of integers service ids. See (/api-docs/list-services.md).
- `contactStage.firstAttempt`, `contactStage.secondAttempt`, `contactStage.thirdAttempt`,`created.timestamp` and `lastUpdated.timestamp` are ISO timestamps. `contactStage.firstAttempt`, `contactStage.secondAttempt`, `contactStage.thirdAttempt` are nullable.

### Not Found

If there is no lead with the provided id, you will get a 404 HTTP response, with the following error message:

```json
{
  "errors": ["Could not find lead with id 2"]
}
```

## Get all Leads

### Request

```http
GET /api/leads?name=John&page=1
```

**NOTES:**

- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- "name" can be partial
- If no search terms are provided, the top 100 rows will be returned

### Response

```json
{
  "leads": [
    {
      "dateOfSignUp": "2019-09-17",
      "leadStatus": "active",
      "contactStage": {
        "first": "2019-05-06T06:00:00.000Z",
        "second": null,
        "third": null
      },
      "eventSources": [1],
      "firstName": "Joel",
      "lastName": "Denning",
      "fullName": "Joel Denning",
      "phone": "5555555555",
      "smsConsent": true,
      "zip": "84115",
      "age": 25,
      "gender": "male",
      "leadServices": [2, 4 6],
      "clientId": 1
    }
  ],
  "pagination": {
    "numLeads": 50,
    "currentPage": 1,
    "pageSize": 100,
    "numPages": 1
  }
}
```

## Create Leads

### Request

```http
POST /api/leads
```

```json
[
  {
    "dateOfSignUp": "2019-09-17",
    "firstName": "Jone",
    "lastName": "Doe",
    "phone": "5555555555",
    "smsConsent": false,
    "zip": "84115",
    "age": 25,
    "gender": "male",
    "eventSources": [1],
    "leadServices": [1, 5, 8]
  },
  {
    "dateOfSignUp": "2019-09-17",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "5555555555",
    "smsConsent": false,
    "zip": "84115",
    "age": 25,
    "gender": "male",
    "eventSources": [1],
    "leadServices": [28]
  },
  {
    "dateOfSignUp": "2019-09-17",
    "firstName": "Jake",
    "lastName": "Doe",
    "phone": "5555555555",
    "smsConsent": true,
    "zip": "84115",
    "age": 25,
    "gender": "male",
    "eventSources": [1],
    "leadServices": [20, 35, 18]
  }
]
```

### Response

#### Success

The response object will be the same as if you do a `GET /api/leads/:id`

```json
{
  "Created leads 1, 2, 3."
}
```

#### Validation Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a firstName"]
}
```

## Modify a Lead

### Request

```http
PATCH /api/leads/:id
```

```json
{
  "dateOfSignUp": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "eventSources": [1],
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "leadServices": [2, 4 6],
  "clientId": 1
}
```

**_Notes_**

- You can omit properties that you do not want to update.
- The "isDeleted" property cannot be modified.

### Response

The response object will be the same as if you do a `GET /api/leads/:id`

## Delete a single Lead

### Request

```http
DELETE /api/leads/:id
```

### Response

An HTTP 204 status is returned if the deletion was successful.

An HTTP 400 status is returned if you cannot delete this event.
