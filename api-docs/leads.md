# Leads

The leads will document potiental clients sourced from CU events.

Here is the list of the valid log types:

- `leadCreated`,
- `leadUpdated`,
- `leadDeleted`

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
  "eventSource": {
    "eventId": 1,
    "eventName": "Health Fair",
    "eventDate": "2019-09-16",
    "eventLocation": "Saint Marks",
    "relatedProgram": {
      "id": 7,
      "programName": "Preventative Health",
      "programDescription": "Preventative Health"
    }
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

- `leadStatus` is an enum with the possible values of `active`, `inactive`, and `converted to client`.
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
