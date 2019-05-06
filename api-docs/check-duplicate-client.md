# Check duplicate clients

In order to verify that duplicate data is not entered into the system, an API is provided for checking if a client
already exists in the system.

## Request

`GET /api/client-duplicates?firstName=Juan&lastName=Rodriguez&birthday=1990-01-30&gender=male`

Notes:

- All query params must be URI encoded

## Response

```json
{
  "numDuplicates": 1,
  "clientDuplicates": [
    {
      "id": 123,
      "firstName": "Juan",
      "lastName": "Rodriguez",
      "birthDate": "1990-01-30",
      "gender": "male"
    }
  ]
}
```
