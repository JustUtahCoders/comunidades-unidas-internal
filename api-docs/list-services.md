# List CU Services

The list of services that Comunidades Unidas provides to its clients is stored in the database and can change over time.
Here is how you can get a list of the services.

## Request

```http
GET /api/services
```

## Response

```json
{
  "services": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship"
    },
    {
      "id": 2,
      "serviceName": "Family Petition",
      "serviceDescription": "Petition for certain family members to receive either a Green Card, a fiancé(e) visa or a K-3/K-4 visa"
    }
  ]
}
```
