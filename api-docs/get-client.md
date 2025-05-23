# Get client

To retrieve a specific client, call the following API.

## Request

```http
GET /api/clients/:id
```

## Response

### Success

```json
{
  "client": {
    "id": 123,
    "dateOfIntake": "2019-05-06",
    "firstName": "Freddy",
    "lastName": "Mercury",
    "fullName": "Freddy Mercury",
    "birthday": "1946-09-05",
    "gender": "male",
    "phone": "8011111111",
    "smsConsent": false,
    "homeAddress": {
      "street": "1211 W Main St.",
      "city": "Salt Lake City",
      "state": "UT",
      "zip": "84095"
    },
    "email": "freddiemercury@gmail.com",
    "civilStatus": "single",
    "countryOfOrigin": "MX",
    "dateOfUSArrival": null,
    "homeLanguage": "english",
    "englishProficiency": "advanced",
    "currentlyEmployed": "unknown",
    "employmentSector": "industrial",
    "payInterval": "every-week",
    "weeklyEmployedHours": "0-20",
    "householdIncome": 42000,
    "householdSize": 1,
    "dependents": 0,
    "housingStatus": "renter",
    "isStudent": true,
    "eligibleToVote": true,
    "registeredToVote": false,
    "clientSource": "facebook",
    "couldVolunteer": true,
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
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    },
    "lastUpdatedBy": {
      "userId": 1,
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    }
  }
}
```

### Not Found

If there is no client with the provided id, you will get a 404 HTTP response, with the following error message:

```json
{
  "errors": ["Could not find client with id 2"]
}
```

## Request

```http
GET /api/clients-by-id?clientId=
```

## Response

### Success

```json
[
  {
    "id": 123,
    "dateOfIntake": "2019-05-06",
    "firstName": "Freddy",
    "lastName": "Mercury",
    "fullName": "Freddy Mercury",
    "birthday": "1946-09-05",
    "gender": "male",
    "phone": "8011111111",
    "smsConsent": false,
    "homeAddress": {
      "street": "1211 W Main St.",
      "city": "Salt Lake City",
      "state": "UT",
      "zip": "84095"
    },
    "email": "freddiemercury@gmail.com",
    "civilStatus": "single",
    "countryOfOrigin": "MX",
    "dateOfUSArrival": null,
    "homeLanguage": "english",
    "englishProficiency": "advanced",
    "currentlyEmployed": "unknown",
    "employmentSector": "industrial",
    "payInterval": "every-week",
    "weeklyEmployedHours": "0-20",
    "householdIncome": 42000,
    "householdSize": 1,
    "dependents": 0,
    "housingStatus": "renter",
    "isStudent": true,
    "eligibleToVote": true,
    "registeredToVote": false,
    "clientSource": "facebook",
    "couldVolunteer": true,
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
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    },
    "lastUpdatedBy": {
      "userId": 1,
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    }
  },

  {
    "id": 123,
    "dateOfIntake": "2019-05-06",
    "firstName": "Daivd",
    "lastName": "Bowie",
    "fullName": "David Bowie",
    "birthday": "1947-01-08",
    "gender": "male",
    "phone": "8011111112",
    "smsConsent": true,
    "homeAddress": {
      "street": "1211 W Main St.",
      "city": "Salt Lake City",
      "state": "UT",
      "zip": "84095"
    },
    "email": "davidbowie@gmail.com",
    "civilStatus": "single",
    "countryOfOrigin": "MX",
    "dateOfUSArrival": null,
    "homeLanguage": "english",
    "englishProficiency": "advanced",
    "currentlyEmployed": "unknown",
    "employmentSector": "industrial",
    "payInterval": "every-week",
    "weeklyEmployedHours": "0-20",
    "householdIncome": 64000,
    "householdSize": 2,
    "dependents": 0,
    "housingStatus": "renter",
    "isStudent": true,
    "eligibleToVote": true,
    "registeredToVote": true,
    "clientSource": "facebook",
    "couldVolunteer": true,
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
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    },
    "lastUpdatedBy": {
      "userId": 1,
      "firstName": "Jolyn",
      "lastName": "Denning",
      "fullName": "Jolyn Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    }
  }
]
```

### Not found

If there is no client with the provided ids, you will get a 404 HTTP response with the following error message:

```json
{
  "errors": ["Could not find clients with ids"]
}
```
