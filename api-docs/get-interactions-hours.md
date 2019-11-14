# Number of Interactions per Hour Range.

Returns the total number of clients who have had at least that many client interaction hours in the given time period, along with the list of clients that match the specified criteria.

## Request

_The request should accept query parameters indicating a time range, number of client interaction hours, and current page._

```http
GET /api/interactions?start=2019-05-06T0&end=2019-05-08T0&=21600&hours=21600&page=1
```

Notes:

- Result is limited to 100 rows ordered by lastName and then firstName
- Values for the query should be URL encoded
- The "page" query parameter defaults to 1

## Response

```json
{
  "totalNumberOfClients": 3,
  "clients": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "gender": "male",
      "timestamp": "2019-05-06T06:00:00.000Z",
      "totalDuration": "06:00:00"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Doe",
      "fullName": "Jane Doe",
      "gender": "female",
      "timestamp": "2019-05-07T06:00:00.000Z",
      "totalDuration": "06:15:00"
    },
    {
      "id": 3,
      "firstName": "Jill",
      "lastName": "Doe",
      "fullName": "Jill Doe",
      "gender": "female",
      "timestamp": "2019-05-08T06:00:00.000Z",
      "totalDuration": "06:30:00"
    }
  ],
  "pagination": {
    "numClients": 3,
    "currentPage": 1,
    "pageSize": 100,
    "numPages": 1
  }
}
```
