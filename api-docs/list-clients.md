# View a list of clients

API is provided to query a list of clients from the database.

##Request
GET /api/clients/?firstName=Mario&lastName=Luigi&zip=84107&page=1

Notes:

- Result is limited to 100 rows ordered by lastName, firstName
- Values for the query should be URL encoded
- "page" query parameter defaults to 1
- "firstName" and "lastName" can be partial
- If "firstName", "lastName", and "zip" are not provided the top 100 rows will be returned ordered by lastName, firstName

##Response

```json
{
  "numClients": 1,
  "clients": [
    {
      "id": 56,
      "firstName": "Mario",
      "lastName": "Luigi",
      "zip": "84107",
      "dob": "01/01/1981",
      "primaryPhone": "5551111111",
      "dateAdded": "04/28/2019",
      "addedBy": "Shigeru Miyamoto"
    }
  ]
}
```
