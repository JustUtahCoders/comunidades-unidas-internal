# Client files

This api is provided to upload and keep track of client files.
To upload or access any file you need the corresponding signed url.

## Get a signed POST URL

```http
  GET /api/clients/files/signedPost
```

### Response

#### Success

```json
{
  "url": "https://yourbukcer.s3.amazonaws.com/",
  "key": "fileKey",
  "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
  "X-Amz-Credential": "awsCredentials",
  "X-Amz-Date": "20191114T194641Z",
  "X-Amz-Expires": "60",
  "X-Amz-Signature": "awsSignature",
  "X-Amz-SignedHeaders": "host"
}
```

**NOTES**

Once you receieve the URL you will need to make a PUT not POST to this URL.

---

## Get a signed GET URL

```http
  GET /apit/clients/files/signedGet
```

### Request

```json
{
  "key": "clientId/fileKey"
}
```

`clientId/key` Required, clientId is going to be the folder assigned to a client then the key is the file.

### Response

#### Success

```json
{
  "url": "https://yourbukcer.s3.amazonaws.com/",
  "key": "fileKey",
  "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
  "X-Amz-Credential": "awsCredentials",
  "X-Amz-Date": "20191114T194641Z",
  "X-Amz-Expires": "60",
  "X-Amz-Signature": "awsSignature",
  "X-Amz-SignedHeaders": "host"
}
```

```json
{
  "errors": ["You must provide a fileKey"]
}
```

---

**NOTES**

You will need the corresponding signed URL from above to access, any of the following API's

---

## Get a client file

```http
  GET /api/clients/:clientId/files/:fileKey
```

### Response

#### Success

```json
{
  "clientId": 1,
  "interactionId": 1,
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "fileKey",
  "fileSize": "10mb",
  "fileExtension": "pdf",
  "fileDesc": "invoice"
}
```

#### Error

If there is no client with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find client with id 2"]
}
```

If there is no file with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find fileKey"]
}
```

---

## Get all client files

```http
  GET /api/clients/:clientId/files
```

### Response

#### Success

```json
{
  "files": [
    {
      "clientId": 1,
      "interactionId": 1,
      "createdBy": {
        "firstName": "Sean",
        "lastName": "White",
        "fullName": "Sean White",
        "timestamp": "2019-11-06T06:00:00.000Z"
      },
      "fileName": "fileKey",
      "fileSize": "10mb",
      "fileExtension": "pdf",
      "fileDesc": "invoice"
    }
  ]
}
```

#### Error

If there is no client with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find client with id 2"]
}
```

---

## Create a client file

```http
  POST /api/clients/:clientId/file
```

### Request

```json
{
  "clientId": 1,
  "interactionId": 1,
  "fileName": "fileKey",
  "fileSize": "10mb",
  "fileExtension": "pdf",
  "fileDesc": "invoice"
}
```

**NOTES**

The `filename` will be included in the signed url. Not in the uploaded file.

### Response

#### Success

```json
{
  "clientId": 1,
  "interactionId": 1,
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "fileKey",
  "fileSize": "10mb",
  "fileExtension": "pdf",
  "fileDesc": "invoice"
}
```

#### Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a id"]
}
```

---

## Create multiple client files

```http
  POST /api/clients/:clientId/files
```

```json
{
  "files": [
    {
      "clientId": 1,
      "interactionId": 1,
      "fileName": "fileKey",
      "fileSize": "10mb",
      "fileExtension": "pdf",
      "fileDesc": "invoice"
    }
  ]
}
```

### Response

#### Success

```json
{
  "files": [
    {
      "clientId": 1,
      "interactionId": 1,
      "createdBy": {
        "firstName": "Sean",
        "lastName": "White",
        "fullName": "Sean White",
        "timestamp": "2019-11-06T06:00:00.000Z"
      },
      "fileName": "fileKey",
      "fileSize": "10mb",
      "fileExtension": "pdf",
      "fileDesc": "invoice"
    }
  ]
}
```

#### Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a id"]
}
```

---

## Soft delete a client file

```http
DELETE /api/clients/:clientId/file/:fileKey
```

### Response

#### Success

An HTTP 204 status is returned if the deletion was sucessful

An HTTP 403 status is return if you cannot delete the file

#### Error

If there is no client with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find client with id 2"]
}
```

If there is no file with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find fileKey"]
}
```

---
