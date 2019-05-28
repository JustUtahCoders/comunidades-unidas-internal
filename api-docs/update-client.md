# Update client

Updating a client is done with the following API.

### Request

```http
PATCH /clients/:id
```

```json
{
  "dateOfIntake": "2019-05-06",
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
  "registeredToVote": false,
  "clientSource": "facebook",
  "couldVolunteer": true,
  "intakeServices": [1, 5, 8]
}
```

#### Notes

- You can omit properties that you do not want to update.

### Response

The response to updating the information is the same as [the response for GET /api/clients/:id](/api-docs/get-client.md)
