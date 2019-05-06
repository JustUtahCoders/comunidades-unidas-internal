# Create client

## Request

```http
POST /api/clients
```

```json
{
  "dateOfIntake": "2019-05-06T06:00:00.000Z",
  "firstName": "Freddy",
  "lastName": "Mercury",
  "birthday": "1946-09-06",
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
  "primaryLanguage": "english",
  "currentlyEmployed": true,
  "employmentSector": "industrial",
  "annualIncome": 42000,
  "householdSize": 1,
  "isStudent": true,
  "eligibleToVote": true,
  "clientSource": "facebook",
  "couldVolunteer": true
}
```

**Notes**

- `dateOfUSArrival` is null for those born in the United States.

## Response

### Success

The response object is the same as if you do a `GET /api/clients/:id`

```json
{
  "id": 123,
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
  "dateOfIntake": "2019-05-06T06:00:00.000Z",
  "firstName": "Freddy",
  "lastName": "Mercury",
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
  "primaryLanguage": "english",
  "currentlyEmployed": true,
  "employmentSector": "industrial",
  "annualIncome": 42000,
  "householdSize": 1,
  "isStudent": true,
  "eligibleToVote": true,
  "clientSource": "facebook",
  "couldVolunteer": true
}
```

**Notes**

- `created.timestamp` and `lastUpdated.timestamp` are unix timestamps
- The possible values for `civilStatus` are `single`, `married`, `commonLawMarriage`, `divorced`, and `widowed`.

### Validation Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a firstName"]
}
```
