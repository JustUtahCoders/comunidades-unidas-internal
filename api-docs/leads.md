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
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16",
    "eventLocation": "Saint Marks"
  },
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "intakeServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    }
  ],
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
- `eventSource` is an array of integer event ids
- `gender` is an enum with possible values of `female`, `male`, `transgender`, `nonbinary`, `other`.
- `intakeServices` is an array of integers service ids. See (/api-docs/list-services.md).
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
GET /api/leads
```

### Response

```json
({
  "id": 1,
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16"
  },
  "firstName": "Harry",
  "lastName": "Potter",
  "fullName": "Harry Potter",
  "phone": "5555555555",
  "smsConsent": false,
  "zip": "84115",
  "age": 39,
  "gender": "male",
  "intakeServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    }
  ],
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
},
{
  "id": 2,
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16"
  },
  "firstName": "Hermione",
  "lastName": "Granger",
  "fullName": "Hermione Granger",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 40,
  "gender": "female",
  "intakeServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    }
  ],
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
},
{
  "id": 3,
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16"
  },
  "firstName": "Ron",
  "lastName": "Weasley",
  "fullName": "Ron Weasley",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 39,
  "gender": "male",
  "intakeServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    }
  ],
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
})
```

## Create a single Lead

### Request

```http
POST /api/leads
```

```json
{
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "eventSource": 1,
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": false,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "intakeServices": [1, 5, 8]
}
```

### Response

#### Success

The response object will be the same as if you do a `GET /api/leads/:id`

```json
{
  "id": 1,
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "inactivityReason": null,
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16"
  },
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "intakeServices": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    }
  ],
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
  "dateOfSignup": "2019-09-17",
  "leadStatus": "active",
  "contactStage": {
    "first": "2019-05-06T06:00:00.000Z",
    "second": null,
    "third": null
  },
  "eventSource": 1,
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": true,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "intakeServices": [2, 4 6]
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
