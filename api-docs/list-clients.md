# View a list of clients

API is provided to query a list of clients from the database.

## Request

GET /api/clients?name=Mario%20Luigi&zip=84107&page=1

Notes:

- Result is limited to 100 rows ordered by lastName, firstName
- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- "name" can be partial
- If "name" and "zip" are not provided the top 100 rows will be returned ordered by lastName, firstName

## Response

```json
{
  "clients": [
    {
      "id": 56,
      "firstName": "Mario",
      "lastName": "Luigi",
      "fullName": "Mario Luigi",
      "zip": "84107",
      "birthday": "1981-01-01",
      "phone": "5551111111",
      "createdBy": {
        "userId": 123,
        "firstName": "Shigeru",
        "lastName": "Miyamoto",
        "fullName": "Shigeru Miyamoto",
        "timestamp": "2019-05-06T06:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "numClients": 50,
    "currentPage": 1,
    "pageSize": 100,
    "numPages": 1
  }
}
```
