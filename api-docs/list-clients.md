# View a list of clients

API is provided to query a list of clients from the database.

## Request

GET /api/clients?name=Mario%20Luigi&zip=84107&page=1&phone=8015558888&id=2&program=1&sortField=firstName&sortOrder=asc&wantsSMS=true&service=2

Notes:

- Result is limited to 100 rows ordered by lastName and then firstName
- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- "name" can be partial
- "phone" can be partial
- If no search terms are provided, the top 100 rows will be returned ordered by lastName, firstName
- "program" is the program id.
- "service" is the service id.
- You may only provide eitehr program or service. Not both.
- "sortField" is one of the following: `id`, `firstName`, `lastName`, `birthday`
- "sortOrder" is one of the following: `asc`, `desc`
- "wantsSMS" is one of the following: `true`, `false`

## Response

```json
{
  "clients": [
    {
      "id": 56,
      "firstName": "Mario",
      "lastName": "Luigi",
      "fullName": "Mario Luigi",
      "address": "100 Main St",
      "city": "Salt Lake City",
      "state": "UT",
      "zip": "84107",
      "birthday": "1981-01-01",
      "phone": "5551111111",
      "email": "marioluigi@nintendo.com",
      "isDeleted": false,
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
