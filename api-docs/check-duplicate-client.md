# Check duplicate clients

In order to verify that duplicate data is not entered into the system, an API is provided for checking if a client
already exists in the system.

## Request

`GET /api/client-duplicates?firstName=Juan&lastName=Rodriguez&birthday=1990-01-30`

Notes:

- All query params must be URI encoded
- `birthday` is optional

## Response

```json
{
  "numDuplicates": 1,
  "clientDuplicates": [
    {
      "id": 123,
      "firstName": "Juan",
      "lastName": "Rodriguez",
      "birthday": "1990-01-30",
      "gender": "male"
    }
  ],
  "possibleLeadSources": [
    {
      "id": 345,
      "firstName": "Juan",
      "lastName": "Rodriguez",
      "birthday": "1990-01-30",
      "leadStatus": "active",
      "gender": "male"
    }
  ]
}
```
