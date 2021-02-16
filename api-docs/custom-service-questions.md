# Custom Service Questions

The list of custom questions to be asked per-service when creating client interactions.

## Create Custom Service Question

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

### Request

```sh
DELETE /api/custom-service-questions/:questionId
```

### Response

HTTP 204 No Content
