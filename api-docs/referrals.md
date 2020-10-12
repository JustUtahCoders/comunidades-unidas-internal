# Referrals

Referrals are when Comunidades Unidas sends a lead to one of its [partners](./partners.md).

## Get Lead Referrals

### Request

```
GET /api/leads/:id/referrals
```

### Response

```json
[
  {
    "id": 1,
    "partnerServiceId": 1,
    "referralDate": "2020-01-01T00:00:00.000Z",
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1
  },
  {
    "id": 2,
    "partnerServiceId": 1,
    "referralDate": "2020-01-01T00:00:00.000Z",
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1
  }
]
```

## Create Lead Referral

### Request

```
POST /api/leads/:id/referrals
```

```json
{
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z"
}
```

### Response

```json
{
  "id": 1,
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z",
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1
}
```

## Update Lead Referral

### Request

```
PATCH /api/leads/:id/referrals/:id
```

```json
{
  "partnerServiceId": 1
}
```

### Response

```json
{
  "id": 1,
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z",
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1
}
```

## Delete Lead Referral

### Request

```
DELETE /api/leads/:id/referrals/:id
```

### Response

HTTP 204 No Content

## Get Client Referrals

### Request

```
GET /api/clients/:id/referrals
```

### Response

```json
[
  {
    "id": 1,
    "partnerServiceId": 1,
    "referralDate": "2020-01-01T00:00:00.000Z",
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1
  },
  {
    "id": 2,
    "partnerServiceId": 1,
    "referralDate": "2020-01-01T00:00:00.000Z",
    "dateAdded": "2020-01-01T00:00:00.000Z",
    "addedBy": 1
  }
]
```

## Create Client Referral

### Request

```
POST /api/clients/:id/referrals
```

```json
{
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z"
}
```

### Response

```json
{
  "id": 1,
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z",
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1
}
```

## Update Client Referral

### Request

```
PATCH /api/clients/:id/referrals/:id
```

```json
{
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z"
}
```

### Response

```json
{
  "id": 1,
  "partnerServiceId": 1,
  "referralDate": "2020-01-01T00:00:00.000Z",
  "dateAdded": "2020-01-01T00:00:00.000Z",
  "addedBy": 1
}
```

## Delete Client Referral

### Request

```
DELETE /api/clients/:id/referrals/:id
```

### Response

HTTP 204 No Content
