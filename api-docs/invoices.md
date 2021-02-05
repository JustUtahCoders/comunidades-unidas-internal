# Invoices

## Get an invoice

### Request

```
GET /api/invoices/:invoiceId?tags=immigration
```

### Response

```json
{
  "id": 123,
  "invoiceNumber": "1003",
  "invoiceDate": "2020-10-01",
  "lineItems": [
    {
      "serviceId": 1,
      "name": "DACA",
      "description": "Prepared the documents",
      "quantity": 1,
      "rate": 40
    }
  ],
  "clientNote": "Client note",
  "totalCharged": 30,
  "totalPaid": 12.55,
  "billTo": "Other Name to Bill To",
  "status": "draft|open|completed|closed",
  "payments": [
    {
      "paymentId": 2434,
      "paymentAmount": 10,
      "amountTowardsInvoice": 8
    }
  ],
  "clients": [45, 23],
  "redacted": false,
  "createdBy": {
    "userId": 123,
    "firstName": "Shigeru",
    "lastName": "Miyamoto",
    "fullName": "Shigeru Miyamoto",
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
```

## Get client invoices

Returns a list of abbreviated invoices

### Request

```
GET /api/clients/:clientId/invoices?tags=immigration
```

### Response

```json
[
  {
    "id": 123,
    "invoiceNumber": "1003",
    "invoiceDate": "2020-10-01",
    "lineItems": [
      {
        "serviceId": 1,
        "name": "DACA",
        "description": "Prepared the documents",
        "quantity": 1,
        "rate": 40
      }
    ],
    "clientNote": "Client note",
    "totalCharged": 30,
    "totalPaid": 12.55,
    "billTo": "Other Name to Bill To",
    "status": "draft|open|completed|closed",
    "payments": [
      {
        "paymentId": 2434,
        "paymentAmount": 10,
        "amountTowardsInvoice": 8
      }
    ],
    "clients": [45, 23],
    "redacted": false,
    "createdBy": {
      "userId": 123,
      "firstName": "Shigeru",
      "lastName": "Miyamoto",
      "fullName": "Shigeru Miyamoto",
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

## Get detached invoices

Detached invoices refer to invoices not associated with a client

### Request

```
GET /api/detached-invoices
```

### Response

```json
[
  {
    "id": 123,
    "invoiceNumber": "1003",
    "invoiceDate": "2020-10-01",
    "lineItems": [
      {
        "serviceId": 1,
        "name": "DACA",
        "description": "Prepared the documents",
        "quantity": 1,
        "rate": 40
      }
    ],
    "clientNote": "Client note",
    "totalCharged": 30,
    "totalPaid": 12.55,
    "billTo": "Other Name to Bill To",
    "status": "draft|open|completed|closed",
    "payments": [
      {
        "paymentId": 2434,
        "paymentAmount": 10,
        "amountTowardsInvoice": 8
      }
    ],
    "clients": [45, 23],
    "redacted": false,
    "createdBy": {
      "userId": 123,
      "firstName": "Shigeru",
      "lastName": "Miyamoto",
      "fullName": "Shigeru Miyamoto",
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

## Create invoice

### Request

```
POST /api/invoices?tags=immigration
```

(no request body)

### Response

```json
{
  "id": 123,
  "invoiceNumber": "1003",
  "invoiceDate": "2020-10-01",
  "lineItems": [],
  "clientNote": "",
  "totalCharged": 0,
  "totalPaid": 0,
  "billTo": null,
  "status": "draft",
  "payments": [],
  "clients": [],
  "redacted": false,
  "createdBy": {
    "userId": 123,
    "firstName": "Shigeru",
    "lastName": "Miyamoto",
    "fullName": "Shigeru Miyamoto",
    "timestamp": "2019-05-06T06:00:00.000Z"
  },
  "lastUpdatedBy": {
    "userId": 123,
    "firstName": "Shigeru",
    "lastName": "Miyamoto",
    "fullName": "Shigeru Miyamoto",
    "timestamp": "2019-05-06T06:00:00.000Z"
  }
}
```

## Updating an invoice

### Request

Any of the following properties may be updated. When updating a property that is an array, the full array must be provided (no partial updates to the array).

```
PATCH /api/invoices/:invoiceId?tags=immigration
```

```json
{
  "invoiceNumber": "1003",
  "invoiceDate": "2020-10-01",
  "lineItems": [
    {
      "serviceId": 1,
      "name": "DACA",
      "description": "Prepared the documents",
      "quantity": 1,
      "rate": 40
    }
  ],
  "clientNote": "",
  "totalCharged": 0,
  "billTo": "Other Bill To Name",
  "status": "draft",
  "payments": [
    {
      "id": 234,
      "amount": 10.6
    }
  ],
  "clients": [1, 4]
}
```

### Response

The response is the same as a subsequent GET to the invoice

## Invoice PDF download

### Request

```
GET /api/invoices/:invoiceId/pdfs?tags=immigration
```

### Response

HTTP 200 with pdf as response body. The content-type and content-disposition headers are set correctly for browser download.

# Payments

## Get client payments

### Request

```
GET /api/clients/:clientId/payments?tags=immigration
```

### Response

```json
[
  {
    "id": 1,
    "paymentDate": "2020-10-01T00:00:00Z",
    "invoices": [
      {
        "invoiceId": 1,
        "amount": 10
      },
      {
        "invoiceId": 2,
        "amount": 10
      }
    ],
    "paymentAmount": 20,
    "paymentType": "cash|credit|debit|check|other",
    "payerClientIds": [23, 76],
    "payerName": "Some payer name",
    "redacted": false,
    "createdBy": {
      "userId": 123,
      "firstName": "Shigeru",
      "lastName": "Miyamoto",
      "fullName": "Shigeru Miyamoto",
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

## Get invoice payments

### Request

```
GET /api/invoices/:invoiceId/payments?tags=immigration
```

### Response

```json
[
  {
    "id": 1,
    "paymentDate": "2020-10-01T00:00:00Z",
    "invoices": [
      {
        "invoiceId": 1,
        "amount": 20
      }
    ],
    "paymentAmount": 20,
    "paymentType": "cash|credit|debit|check|other",
    "payerClientIds": [23, 76],
    "payerName": "Some payer name",
    "donationId": 4543,
    "donationAmount": 21,
    "redacted": false,
    "createdBy": {
      "userId": 123,
      "firstName": "Shigeru",
      "lastName": "Miyamoto",
      "fullName": "Shigeru Miyamoto",
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

## Create payment

### Request

```
POST /api/payments?tags=immigration
```

```json
{
  "paymentDate": "2020-10-01T00:00:00Z",
  "invoices": [
    {
      "invoiceId": 1,
      "amount": 20
    }
  ],
  "paymentAmount": 20,
  "paymentType": "cash|credit|debit|check|other",
  "donationAmount": 10,
  "payerClientIds": [23, 76],
  "payerName": "Some payer name"
}
```

### Response

The response is the same as a subsequent GET

## Update payment

### Request

```
PATCH /api/payments/:paymentId?tags=immigration
```

```json
{
  "paymentDate": "2020-10-01T00:00:00Z",
  "invoices": [
    {
      "invoiceId": 1,
      "amount": 20
    }
  ],
  "paymentAmount": 20,
  "paymentType": "cash|credit|debit|check|other",
  "donationAmount": 10,
  "payerClientIds": [23, 76],
  "payerName": "Some payer name"
}
```

## Delete payment

### Request

```
DELETE /api/payments/:paymentId
```

### Response

HTTP 204 No Content

# Receipts

## Get payment receipt

### Request

```
GET /api/payments/:paymentId/receipts?tags=immigration
```

### Response

A PDF document, with correct content-type and content-disposition headers for browser download.

## Get detached payments

Detached payments are payments not associated with a CU client.

### Request

```
GET /api/detached-payments?tags=immigration
```

### Response

```json
[
  {
    "id": 1,
    "paymentDate": "2020-10-01T00:00:00Z",
    "invoices": [
      {
        "invoiceId": 1,
        "amount": 10
      },
      {
        "invoiceId": 2,
        "amount": 10
      }
    ],
    "paymentAmount": 20,
    "paymentType": "cash|credit|debit|check|other",
    "payerClientIds": [23, 76],
    "payerName": "Some payer name",
    "redacted": false,
    "createdBy": {
      "userId": 123,
      "firstName": "Shigeru",
      "lastName": "Miyamoto",
      "fullName": "Shigeru Miyamoto",
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
