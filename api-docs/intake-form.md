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
        "key": "firstName",
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
