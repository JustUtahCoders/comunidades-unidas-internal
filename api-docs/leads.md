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
  "eventSource": [
    {
      "eventId": 1,
      "eventName": "Health Fair",
      "eventLocation": "Saint Marks"
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
      "serviceName": "Citizenship"
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
- `eventSource` is an array of integer event ids
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
GET /api/leads?page=12
```

**_Notes_**

- Result is limited to 100 rows ordered by lastName and then firstName
- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- If no search terms are provided, the top 100 rows will be returned ordered by lastName, firstName

### Response

```json
[
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
    "eventSource": [
      {
        "eventId": 1,
        "eventName": "Health Fair",
        "eventLocation": "Saint Marks"
      }
    ],
    "firstName": "Harry",
    "lastName": "Potter",
    "fullName": "Harry Potter",
    "phone": "5555555555",
    "smsConsent": false,
    "zip": "84115",
    "age": 39,
    "gender": "male",
    "leadServices": [
      {
        "id": 1,
        "serviceName": "Citizenship"
      }
    ],
    "clientId": 1,
    "isDeleted": false,
    "clientId": 1,
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
    "dateOfSignUp": "2019-09-17",
    "leadStatus": "active",
    "contactStage": {
      "first": "2019-05-06T06:00:00.000Z",
      "second": null,
      "third": null
    },
    "inactivityReason": null,
    "eventSource": [
      {
        "eventId": 1,
        "eventName": "Health Fair",
        "eventLocation": "Saint Marks"
      }
    ],
    "firstName": "Hermione",
    "lastName": "Granger",
    "fullName": "Hermione Granger",
    "phone": "5555555555",
    "smsConsent": true,
    "zip": "84115",
    "age": 40,
    "gender": "female",
    "leadServices": [
      {
        "id": 1,
        "serviceName": "Citizenship"
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
  },
  {
    "id": 3,
    "dateOfSignUp": "2019-09-17",
    "leadStatus": "active",
    "contactStage": {
      "first": "2019-05-06T06:00:00.000Z",
      "second": null,
      "third": null
    },
    "inactivityReason": null,
    "eventSource": [
      {
        "eventId": 1,
        "eventName": "Health Fair",
        "eventLocation": "Saint Marks"
      }
    ],
    "firstName": "Ron",
    "lastName": "Weasley",
    "fullName": "Ron Weasley",
    "phone": "5555555555",
    "smsConsent": true,
    "zip": "84115",
    "age": 39,
    "gender": "male",
    "leadServices": [
      {
        "id": 1,
        "serviceName": "Citizenship"
      }
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

## Create a single Lead

### Request

```http
POST /api/leads
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
  "eventSource": [1],
  "firstName": "Joel",
  "lastName": "Denning",
  "fullName": "Joel Denning",
  "phone": "5555555555",
  "smsConsent": false,
  "zip": "84115",
  "age": 25,
  "gender": "male",
  "leadServices": [1, 5, 8],
  "clientId": 1
}
```

### Response

#### Success

The response object will be the same as if you do a `GET /api/leads/:id`

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
  "eventSource": [
    {
      "eventId": 1,
      "eventName": "Health Fair",
      "eventLocation": "Saint Marks"
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
      "serviceName": "Citizenship"
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
  "eventSource": [1],
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
