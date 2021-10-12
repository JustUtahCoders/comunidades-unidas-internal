# Intake Form

The Intake Form APIs allow you to customize the behavior of the client intake form.

## Get Questions

To get the questions in the intake form, call the following api:

### Request

```
GET /api/intake-questions
```

### Response

```json
{
  "sections": {
    "basicInfo": [
      {
        "type": "builtin",
        "section": "basicInfo",
        "dataKey": "firstName",
        "label": "First Name",
        "placeholder": "Jane Doe",
        "required": true
      }
    ],
    "contactInfo": [],
    "demographicInfo": [],
    "source": [],
    "interests": []
  }
}
```

## Put Questions

To update the questions in the intake form, call the following api:

### Request

```
PUT /api/intake-questions
```

```json
{
  "sections": {
    "basicInfo": [
      {
        "id": 1,
        "dataKey": "firstName",
        "label": "First Name",
        "placeholder": "Jane Doe",
        "required": true
      }
    ],
    "contactInfo": [],
    "demographicInfo": [],
    "source": [],
    "interests": []
  }
}
```

### Response

```json
{
  "sections": {
    "basicInfo": [
      {
        "type": "builtin",
        "section": "basicInfo",
        "dataKey": "firstName",
        "label": "First Name",
        "placeholder": "Jane Doe",
        "required": true
      }
    ],
    "contactInfo": [],
    "demographicInfo": [],
    "source": [],
    "interests": []
  }
}
```
