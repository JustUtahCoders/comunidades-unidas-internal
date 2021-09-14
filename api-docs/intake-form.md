# Intake Form

The Intake Form APIs allow you to customize the behavior of the client intake form.

## Get Questions

To get the questions in the intake form, call the following api:

### Request

```
GET /api/intake-form-questions
```

### Response

```json
{
  "sections": {
    "basicInfo": [],
    "contactInfo": [],
    "demographicInfo": [],
    "source": [],
    "interests": []
  }
}
```
