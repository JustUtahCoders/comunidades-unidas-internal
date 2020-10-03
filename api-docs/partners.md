# Partners

Partners are other nonprofits and organizations that Comunidades Unidas sends referrals to.

## List Partners

### Request

```
GET /api/partners?includeInactive=false
```

### Response

```json
[
  {
    "id": 1,
    "name": "Partner name",
    "isActive": true,
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1,
    "dateModified": "2020-01-01T00:00:00.000Z",
    "modifiedBy": 1
  },
  {
    "id": 2,
    "name": "Partner name",
    "isActive": false,
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1,
    "dateModified": "2020-01-01T00:00:00.000Z",
    "modifiedBy": 1
  }
]
```

## Add Partner

### Request

```
POST /api/partners
```

```json
{
  "name": "Partner name",
  "isActive": true
}
```

### Response

```json
{
  "id": 1,
  "name": "Partner name",
  "isActive": true,
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1,
  "dateModified": "2020-01-01T00:00:00.000Z",
  "modifiedBy": 1
}
```

## Update Partner

```
PATCH /api/partners
```

### Request

```json
{
  "name": "Partner name",
  "isActive": true
}
```

### Response

```json
{
  "id": 1,
  "name": "Partner name",
  "isActive": true,
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1,
  "dateModified": "2020-01-01T00:00:00.000Z",
  "modifiedBy": 1
}
```

## Add Partner Service

### Request

```
POST /api/partners/:id/services
```

```json
{
  "partnerId": 1,
  "name": "Service name",
  "isActive": true
}
```

### Response

```json
{
  "id": 1,
  "partnerId": 1,
  "name": "Service name",
  "isActive": true,
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1,
  "dateModified": "2020-01-01T00:00:00.000Z",
  "modifiedBy": 1
}
```

## Update Partner Service

### Request

```
PATCH /api/partners/:id/services
```

```json
{
  "partnerId": 1,
  "name": "Service name",
  "isActive": true,
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1,
  "dateModified": "2020-01-01T00:00:00.000Z",
  "modifiedBy": 1
}
```

### Response

```json
{
  "id": 1,
  "partnerId": 1,
  "name": "Service name",
  "isActive": true,
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1,
  "dateModified": "2020-01-01T00:00:00.000Z",
  "modifiedBy": 1
}
```
