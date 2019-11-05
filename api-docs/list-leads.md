# View a list of leads

API is provided to query a list of leads from the database.

## Request

GET /api/leads?name=John%Jane&page=1

**NOTES:**

- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- "name" can be partial
- If no search terms are provided, the top 100 rows will be returned

## Response

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
