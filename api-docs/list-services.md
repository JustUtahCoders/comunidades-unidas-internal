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
      "isActive": true
    },
    {
      "id": 2,
      "serviceName": "Family Petition",
      "serviceDescription": "Petition for certain family members to receive either a Green Card, a fiancé(e) visa or a K-3/K-4 visa",
      "programId": 1,
      "programName": "Immigration",
      "isActive": true
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
