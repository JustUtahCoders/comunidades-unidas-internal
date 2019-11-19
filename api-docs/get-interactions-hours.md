# Number of Interactions per Hour Range.

Returns the total number of clients who have had at least that many client interaction hours in the given time period, along with the list of clients that match the specified criteria.

## Request

_The request should accept query parameters indicating a time range, number of client interaction hours, and current page._

Example case:

```http
GET /api/reports/interaction-hours-by-client?start=2019-05-06T0&end=2019-05-08T0&minInteractionMinutes=21600&page=1
```

Notes:

- Result is limited to 100 rows ordered by lastName and then firstName
- Values for the query should be URL encoded
- The 'page' query parameter defaults to 1
- The 'start' parameter denotes the lower class limit (date and time)
- The 'end' parameter denotes the upper class limit (date and time)
- The 'minInteractionSeconds' parameter specifies the least number of hours the query will filter
- reportDefaultParameters explains values for parameters left blank or empty

## Response

```json
{
  "clients": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "gender": "male",
      "birthday": "1969-08-15",
      "totalDuration": "06:00:00"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Doe",
      "fullName": "Jane Doe",
      "gender": "female",
      "birthday": "1969-08-16",
      "totalDuration": "06:15:00"
    },
    {
      "id": 3,
      "firstName": "Jill",
      "lastName": "Doe",
      "fullName": "Jill Doe",
      "gender": "female",
      "birthday": "1969-08-17",
      "totalDuration": "06:30:00"
    }
  ],
  "pagination": {
    "numClients": 3,
    "currentPage": 1,
    "pageSize": 100,
    "numPages": 1
  },
  "reportParameters": {
    "start": "2019-05-06T0",
    "end": "2019-05-06T0",
    "minInteractionSeconds": 21600,
    "page": 1
  }
}
```
