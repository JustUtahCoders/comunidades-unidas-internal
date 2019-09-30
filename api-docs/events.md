# Events

The list of events will document CU events.

## Get single Event

### Request

```http
GET /api/event/:id
```

### Response

#### Success

```json
{
  "id": 1,
  "eventName": "Heath Fair",
  "eventDate": "2019-09-16",
  "eventLocation": "Saint Marks",
  "programId": {
    "id": 7,
    "programName": "Preventive Health",
    "programDescription": "Preventive Health"
  },
  "totalAttendence": 150,
  "isDeleted": false
}
```

**_Note_**

- `relatedProgram` is an array of integers program ids. See (/api-docs/list-services.md).

#### Not Found

If there is no lead with the provided id, you will get a 404 HTTP response, with the following error message:

```json
{
  "errors": ["Could not find event with id 2"]
}
```

## Get all Events

### Request

```http
GET /api/events
```

### Response

```json
[
  {
    "id": 1,
    "eventName": "Heath Fair",
    "eventDate": "2019-09-16",
    "eventLocation": "Saint Marks",
    "programId": {
      "id": 7,
      "programName": "Preventive Health",
      "programDescription": "Preventive Health"
    },
    "totalAttendence": 150,
    "isDeleted": false
  },
  {
    "id": 2,
    "eventName": "Job Fair",
    "eventDate": "2019-09-24",
    "eventLocation": "Salt Lake City Library",
    "relatedProgram": {
      "id": 9,
      "programName": "Workers' Rights",
      "programDescription": "Workers' Rights"
    },
    "totalAttendence": 150,
    "isDeleted": false
  }
]
```

## Create Event

```http
POST /api/events
```

```json
{
  "eventName": "Job Fair",
  "eventDate": "2019-09-24",
  "eventLocation": "Salt Lake City Library",
  "programId": 9,
  "totalAttendence": 150
}
```
