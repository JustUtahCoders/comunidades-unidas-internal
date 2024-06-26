# Custom Service Questions

The list of custom questions to be asked per-service when creating client interactions.

## Get Custom Service Questions

### Request

```sh
GET /api/custom-service-questions?includeDeleted=false
```

Notes:

- The `includeDeleted` query parameter allows you to include deleted questions.

### Response

```json
[
  {
    "id": 1,
    "type": "number",
    "label": "How many people were on the SNAP application?",
    "serviceId": 10
  },
  {
    "id": 2,
    "type": "boolean",
    "label": "Was this a first time DACA application?",
    "serviceId": 12
  }
]
```

## Create Custom Service Question

Only Admin users may create custom service questions.

### Request

```sh
POST /api/custom-service-questions
```

```json
{
  "type": "text|number|select|boolean|date",
  "label": "What is your relationship to this person?",
  "serviceId": 10,
  "options": [
    {
      "name": "Spouse",
      "value": "spouse"
    }
  ]
}
```

### Response

```json
{
  "id": 123,
  "type": "text|number|select|boolean|date",
  "label": "What is your relationship to this person?",
  "serviceId": 10,
  "options": [
    {
      "name": "Spouse",
      "value": "spouse"
    }
  ]
}
```

## Update Custom Service Question

Only Admin users may update custom service questions.

### Request

Note that top-level properties are shallow merged (not deep merged)

```sh
PATCH /api/custom-service-questions/:questionId
```

```json
{
  "type": "text|number|select|boolean|date",
  "label": "What is your relationship to this person?",
  "serviceId": 9,
  "options": [
    {
      "name": "Spouse",
      "value": "spouse"
    }
  ]
}
```

### Response

```json
{
  "id": 123,
  "type": "text|number|select|boolean|date",
  "label": "What is your relationship to this person?",
  "serviceId": 9,
  "options": [
    {
      "name": "Spouse",
      "value": "spouse"
    }
  ]
}
```

## Delete Custom Service Question

Only Admin users may delete custom service questions.

### Request

```sh
DELETE /api/custom-service-questions/:questionId
```

### Response

HTTP 204 No Content
