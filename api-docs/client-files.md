# Client files

This api is provided to upload and keep track of client files.
To upload or access any file you need the corresponding signed url.

### API flow

If performing an upload you will get a signed url via `/api/signed-file-uploads` you will then make
a PUT request to the url like so

```javascript
axios.put(signedRequest, file, options).then(result => {
  if (result.data.success) {
    //Make the request to create a client file /api/clients/:clientId/file
  }
});
```

After you upload the file to S3, you need to tell the web server that you
did so by calling `http POST /api/clients/:clientId/files`

For each file that you want to download you would make a request to `/api/clients/:clientId/files/:fileId/signed-downloads` then
you would make a request on the front end like so `window.location.href = downloadurl`

## Get a signed POST URL

```http
GET /api/clients/:clientId/signed-file-uploads
```

### Response

#### Success

```json
{
  "uploadUrl": "https://bucket.s3.amazonaws.com/fileId?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=awsCredential&X-Amz-Date=20191116T030355Z&X-Amz-Expires=60&X-Amz-Signature=signature&X-Amz-SignedHeaders=host"
}
```

**NOTES**

Once you receive the URL you will need to make a PUT not POST to this URL.

---

## Get a signed GET URL

```http
GET /api/clients/:clientId/files/:fileId/signed-downloads
```

### Response

#### Success

```json
{
  "downloadUrl": "https://bucket.s3.amazonaws.com/fileId?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=awsCredential&X-Amz-Date=20191116T030355Z&X-Amz-Expires=60&X-Amz-Signature=signature&X-Amz-SignedHeaders=host"
}
```

#### Errors

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
  "errors": ["Could not find file with fileId"]
}
```

---

**NOTES**

You will need the corresponding signed URL from above to access, any of the following API's

---

## Get a client file

```http
GET /api/clients/:clientId/files/:fileId
```

### Response

#### Success

```json
{
  "id": 1,
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "fileId",
  "fileSize": "10mb",
  "fileExtension": "pdf"
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
  "errors": ["Could not find fileId"]
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
      "id": 1,
      "createdBy": {
        "firstName": "Sean",
        "lastName": "White",
        "fullName": "Sean White",
        "timestamp": "2019-11-06T06:00:00.000Z"
      },
      "fileName": "fileId",
      "fileSize": "10mb",
      "fileExtension": "pdf"
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
  "fileName": "fileId",
  "fileSize": "10mb",
  "fileExtension": "pdf"
}
```

### Response

#### Success

```json
{
  "id": 1,
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "fileId",
  "fileSize": "10mb",
  "fileExtension": "pdf"
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
  "errors": ["Could not find fileId"]
}
```

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a file"]
}
```

---

## Soft delete a client file

```http
DELETE /api/clients/:clientId/file/:fileId
```

This is a soft delete it will only flag the fileId in the database it will still be stored in s3

### Response

#### Success

An HTTP 204 status is returned if the deletion was successful

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
  "errors": ["Could not find fileId"]
}
```

---
