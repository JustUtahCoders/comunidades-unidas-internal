# Delete Client

In order to allow for restoration of data in the event of an accidental delete, this will be a soft delete action.

## Request

```http
DELETE /api/clients/:clientId
```

```json
{
  "isDeleted": true
}
```

**Notes**

- `isDeleted` is a boolean.
- Only the `isDeleted` field should be altered in this action.
- A client will not be able to be editted once deleted unless the deletion has been manually reversed.

## Response

An HTTP 204 status is retured if the deletion was sucessful.

An HTTP 400 status is retured if you cannot delete this client.
