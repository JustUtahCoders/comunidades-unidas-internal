# Client files

This api is provided to upload and keep track of client files.

## Get a single client file

```http
GET /api/clients/:clientId/files/:fileId
```

### Response

### Success

```json
{
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "file-1",
  "fileSize": "10mb",
  "fileExtension": "jpeg",
  "fileNote": "some note here"
}
```

#### Not Found

If there is no client with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find client with id 2"]
}
```

If there is no file with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find file with id 123"]
}
```

&nbsp;

---

&nbsp;

## Get all client files

```http
GET /api/clients/:id/files
```

### Response

#### Success

The response for all files will look identical to get a single file but will return a array of files

```json
{
  "files": [
    {
      "createdBy": {
        "firstName": "Sean",
        "lastName": "White",
        "fullName": "Sean White",
        "timestamp": "2019-11-06T06:00:00.000Z"
      },
      "fileName": "file-1",
      "fileSize": "10mb",
      "fileExtension": "jpeg",
      "fileNote": "some note here"
    }
  ]
}
```

#### Not Found

If there is no client with the provided id, you will get a 404 HTTP response, with the following error

```json
{
  "errors": ["Could not find client with id 2"]
}
```

&nbsp;

---

&nbsp;

## Create a single client file

```http
POST /api/client/file
```

### Request

```json
{
  "clientId": 1,
  "fileName": "filename.ext",
  "fileNote": "Some note here"
}
```

**_Notes_**

`fileNote` is not required and is limited to 200 characters

### Response

The response will look identical to get a client file

```json
{
  "createdBy": {
    "firstName": "Sean",
    "lastName": "White",
    "fullName": "Sean White",
    "timestamp": "2019-11-06T06:00:00.000Z"
  },
  "fileName": "file-1",
  "fileSize": "10mb",
  "fileExtension": "jpeg",
  "fileNote": "some note here"
}
```

**_Notes_**

### Validation Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a id"]
}
```

&nbsp;

---

&nbsp;

## Create multiple client files

```http
POST /api/clients/:clientId/files
```

### Request

```json
{
  "clientId": "1",
  "files": [
    {
      "fileName": "filname.ext",
      "fileNote": "Some note here"
    },
    "...."
  ]
}
```

### Response

The response will look identical to get all client files execpt that it will only return the array of the current files that you are uploading

```json
{
  "files": [
    {
      "createdBy": {
        "firstName": "Sean",
        "lastName": "White",
        "fullName": "Sean White",
        "timestamp": "2019-11-06T06:00:00.000Z"
      },
      "fileName": "file-1",
      "fileSize": "file://host/path"
    },
    "..."
  ]
}
```

**_Notes_**

### Validation Error

Validation errors will respond with HTTP status 400.

```json
{
  "errors": ["You must provide a id"]
}
```

&nbsp;

---

&nbsp;

## Delete a single client file

```http
DELETE /api/client/:clientId/files/:files
```

**note**

This will ne a hard delete of the file. Should indicate to the client that this is permanant, and cannot be reversed.

## Response

An HTTP 204 status is returned if the deletion was sucessful

An HTTP 400 status is return if you cannot delete the file
