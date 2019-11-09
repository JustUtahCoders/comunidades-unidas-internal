# Events

Comunidades Unidas holds events for the general public that are accessible through this API.

## Get single Event

### Request

```http
GET /api/events/:id
```

### Response

#### Success

```json
{
  "id": 1,
  "eventName": "Heath Fair",
  "eventDate": "2019-09-16",
  "eventLocation": "Saint Marks",
  "totalAttendance": 150,
  "isDeleted": false,
  "createdBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 1,
    "firstName": "Joel",
    "lastName": "Denning",
    "fullName": "Joel Denning",
    "timestamp": "2019-05-06T06:00:00.000Z"
  }
}
```

#### Not Found

If there is no event with the provided id, you will get a 404 HTTP response, with the following error message:

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
    "totalAttendance": 150,
    "isDeleted": false,
    "createdBy": {
      "userId": 1,
      "firstName": "Joel",
      "lastName": "Denning",
      "fullName": "Joel Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    },
    "lastUpdatedBy": {
      "userId": 1,
      "firstName": "Joel",
      "lastName": "Denning",
      "fullName": "Joel Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    }
  },
  {
    "id": 2,
    "eventName": "Job Fair",
    "eventDate": "2019-09-24",
    "eventLocation": "Salt Lake City Library",
    "totalAttendance": 150,
    "isDeleted": false,
    "createdBy": {
      "userId": 1,
      "firstName": "Joel",
      "lastName": "Denning",
      "fullName": "Joel Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    },
    "lastUpdatedBy": {
      "userId": 1,
      "firstName": "Joel",
      "lastName": "Denning",
      "fullName": "Joel Denning",
      "timestamp": "2019-05-06T06:00:00.000Z"
    }
  }
]
```

### Notes

- The list of events are ordered the eventDate (descending)

## Create Event

### Request

```http
POST /api/events
```

```json
{
  "eventName": "Job Fair",
  "eventDate": "2019-09-24",
  "eventLocation": "Salt Lake City Library",
  "totalAttendance": 150
}
```

### Response

The response object will be the same as for GET /api/events/:id

## Modify an Event

```http
PATCH /api/events/:id
```

```json
{
  "eventName": "Job Fair",
  "eventDate": "2019-09-24",
  "eventLocation": "Salt Lake City Library",
  "totalAttendance": 150
}
```

**_Notes_**

- You can omit properties that you do not want to update.
- The "isDeleted" property cannot be modified.

### Response

#### Success

The response object will be the same as if you do a `GET /api/events/:id`

#### Validation Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a firstName"]
}
```

## Delete a single event

### Request

```http
DELETE /api/events/:id
```

### Response

An HTTP 204 status is returned if the deletion was successful.

An HTTP 400 status is returned if you cannot delete this event.
