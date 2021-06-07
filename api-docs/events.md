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
  "totalAttendance": 62,
  "attendanceMale": 32,
  "attendanceFemale": 28,
  "attendanceOther": 2,
  "attendanceUnknown": 0,
  "totalLeads": 15,
  "leadsConvertedToClients": 5,
  "materialsDistributed": [
    {
      "materialId": 1,
      "name": "Servicios De CU",
      "quantityDistributed": 25
    }
  ],
  "leadGenders": {
    "male": 2,
    "female": 3,
    "transgender": 0
  },
  "clientGenders": {
    "male": 2,
    "female": 3,
    "transgender": 0
  },
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
  },
  "leads": [
    {
      "leadId": 1,
      "firstName": "Justin",
      "lastName": "McMurdie",
      "fullName": "Justin McMurdie"
    },
    {
      "leadId": 2,
      "firstName": "Obi-Wan",
      "lastName": "Kenobi",
      "fullName": "Obi-Wan Kenobi"
    }
  ]
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
    "totalLeads": 15,
    "leadsConvertedToClients": 5,
    "isDeleted": false,
    "totalMaterialsDistributed": 50,
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
    "totalLeads": 15,
    "leadsConvertedToClients": 5,
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
  "attendanceMale": 32,
  "attendanceFemale": 28,
  "attendanceOther": 2,
  "attendanceUnknown": 0,
  "materialsDistributed": [
    {
      "materialId": 1,
      "quantityDistributed": 50
    }
  ]
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
  "attendanceMale": 32,
  "attendanceFemale": 28,
  "attendanceOther": 2,
  "attendanceUnknown": 0,
  "materialsDistributed": [
    {
      "materialId": 1,
      "quantityDistributed": 50
    }
  ]
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

## Get Event Materials

Event materials are things like pamphlets, documents, etc that are given to people who attend CU events.

### Request

```sh
GET /api/materials
```

### Response

```json
[
  {
    "id": 1,
    "name": "Servicios de CU"
  },
  {
    "id": 2,
    "name": "Derechos de los trabajadores"
  },
  {
    "id": 3,
    "name": "Lista de recursos"
  },
  {
    "id": 4,
    "name": "Censo"
  }
]
```

## Get Event Material

### Request

```
GET /api/materials/:materialId
```

### Response

```json
{
  "id": 8,
  "name": "Test Material"
}
```

## Create Event Material

### Request

```sh
POST /api/materials
```

```json
{
  "name": "Servicios De CU"
}
```

### Response

```json
{
  "id": 1,
  "name": "Servicios de CU"
}
```

## Update Event Material

### Request

```sh
PATCH /api/materials/:materialId
```

```json
{
  "name": "Servicios de CU"
}
```

### Response

```json
{
  "id": 1,
  "name": "Servicios de CU"
}
```

## Delete Event Material

### Request

```sh
DELETE /api/materials/:materialId
```

### Response

HTTP 204 (No Content)
