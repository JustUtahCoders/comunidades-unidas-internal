# CU Programs and Services

## List programs and services

The list of services that Comunidades Unidas provides to its clients is stored in the database and can change over time.
Here is how you can get a list of the services.

### Request

```http
GET /api/services?includeInactive=false
```

### Response

```json
{
  "services": [
    {
      "id": 1,
      "serviceName": "Citizenship",
      "serviceDescription": "Gain United States citizenship",
      "programId": 1,
      "programName": "Immigration",
      "defaultLineItemName": "Immigration",
      "defaultLineItemDescription": "Filled out this document",
      "defaultLineItemRate": 40,
      "defaultInteractionType": "inPerson",
      "defaultInteractionLocation": "CUOffice",
      "defaultInteractionDuration": "03:00:00",
      "isActive": true,
      "customQuestions": [
        {
          "id": 1,
          "type": "text|number|boolean|select|date",
          "label": "When did you first arrive to the United States?"
        }
      ]
    },
    {
      "id": 2,
      "serviceName": "Family Petition",
      "serviceDescription": "Petition for certain family members to receive either a Green Card, a fiancé(e) visa or a K-3/K-4 visa",
      "programId": 1,
      "programName": "Immigration",
      "defaultLineItemName": "Family Petition",
      "defaultLineItemDescription": "Filled out the paperwork",
      "defaultLineItemRate": 40,
      "defaultInteractionType": "inPerson",
      "defaultInteractionLocation": "CUOffice",
      "defaultInteractionDuration": "03:00:00",
      "isActive": true,
      "customQuestions": [
        {
          "id": 2,
          "type": "select",
          "label": "What is your relationship to this person?",
          "options": [
            {
              "name": "Spouse",
              "value": "spouse"
            },
            {
              "name": "Sibling",
              "value": "sibling"
            },
            {
              "name": "Child",
              "value": "child"
            }
          ]
        }
      ]
    }
  ],
  "programs": [
    {
      "id": 1,
      "programName": "Immigration",
      "programDescription": "Immigration-related services",
      "isActive": true
    },
    {
      "id": 2,
      "programName": "Nutrition / CRYS / SNAP",
      "programDescription": "Nutrition services",
      "isActive": true
    }
  ]
}
```

### Notes

- `includeInactive` defaults to false. When true, the inactive programs and services are returned.
- `isActive` is a property on individual services. A program is inactive if and only if all its services are inactive.

## Create a service

Only admin users may create services

### Request

```http
POST /api/services
```

```json
{
  "serviceName": "Citizenship",
  "serviceDescription": "Gain United States citizenship",
  "programId": 1,
  "defaultLineItemName": "Citizenship",
  "defaultLineItemDescription": "Filled out the paperwork",
  "defaultLineItemRate": 40,
  "defaultInteractionType": "inPerson",
  "defaultInteractionLocation": "CUOffice",
  "defaultInteractionDuration": "03:00:00",
  "isActive": true
}
```

### Response

The response object is the full service object.

### Notes

- `id` must not be in the request
- `isActive` may be omitted, and defaults to true.

## Update a service

Only admin users may update services.

### Request

```http
PATCH /api/services/:serviceId
```

```json
{
  "serviceName": "Citizenship",
  "serviceDescription": "Gain United States citizenship",
  "programId": 1,
  "defaultLineItemName": "Citizenship",
  "defaultLineItemDescription": "Filled out the paperwork",
  "defaultLineItemRate": 40,
  "defaultInteractionType": "inPerson",
  "defaultInteractionLocation": "CUOffice",
  "defaultInteractionDuration": "03:00:00",
  "isActive": true
}
```

### Response

The response object is the full service object.

### Notes

- You cannot modify `id` or `programDescription`.

## Create a program

### Request

```http
POST /api/programs
```

```json
{
  "programName": "Immigration",
  "programDescription": "Immigration-related services",
  "isActive": true
}
```

## Response

```json
{
  "id": 15,
  "programName": "Immigration",
  "programDescription": "Immigration-related services",
  "isActive": true
}
```

## Modify a program

```http
PATCH /api/programs
```

### Request

```json
{
  "programName": "Immigration",
  "programDescription": "Immigration-related services"
}
```

### Response

The response object is the full program object.

### Notes

- You may not directly change `isActive` for a program. Instead, it is a derived value, where it is false only when all of its containing services are inactive.
