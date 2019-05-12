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
  "homeLanguage": "english",
  "currentlyEmployed": "n/a",
  "employmentSector": "industrial",
  "payInterval": "every-week",
  "weeklyEmployedHours": "0-20",
  "householdIncome": 42000,
  "householdSize": 1,
  "dependents": 0,
  "housingStatus": "renter",
  "isStudent": true,
  "eligibleToVote": true,
  "clientSource": "facebook",
  "couldVolunteer": true,
  "intakeServices": []
}
```

**Notes**

- `dateOfUSArrival` is null for those born in the United States.
- `currentlyEmployed` is an enum with possible values `yes`, `no`, `n/a`, and `unknown`.
- `payInterval` is an enum with possible values `every-week`, `every-two-weeks`, `every-month`, `every-quarter`, `every-year`
- `weeklyEmployedHours` is an enum with possible values `0-20`, `21-30`, `31-40`, `41+`.
- `housingStatus` is an enum with possible values `renter`, `homeowner`, and `other`.

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
  "homeLanguage": "english",
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
  "clientSource": "facebook",
  "couldVolunteer": true,
  "intakeServices": []
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
