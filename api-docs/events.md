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
