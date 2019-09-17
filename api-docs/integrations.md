# Integrations

CU Database integrates with other software systems, to ease the data entry burden on the CU Staff. All API operations
related to integrations are specific to one client at a time.

## View integrations

### Request

```http
GET /api/clients/:id/integrations
```

### Response

```json
{
  "integrations": [
    {
      "id": "JPLS",
      "name": "Juntos Por La Salud",
      "status": "enabled",
      "lastSync": "1990-01-01T00:00.000Z",
      "externalId": "asdf6776sd5fda7s657fds"
    }
  ]
}
```

### Notes

- `id` is different from ids from other APIs -- it is not a MySQL integer id.
- `status` may be one of the following: `enabled`, `disabled`, or `broken`.
- `lastSync` is a timestamp referring to the last time a successful sync occurred.
- `externalId` refers to the unique id for the client in the external software system that has been integrated with.

## Update integration

### Request

```http
PATCH /api/clients/:id/integrations/:id
```

```json
{
  "status": "enabled",
  "externalId": "nsfd789sdf7fs97sdf"
}
```

### Response

```json
{
  "id": "JPLS",
  "name": "Juntos Por La Salud",
  "status": "enabled",
  "lastSync": "1990-01-01T00:00.000Z",
  "externalId": "asdf6776sd5fda7s657fds"
}
```

### Notes

- Only `status` and `externalId` may be sent in the request body
- Changing the status to `enabled` results in an attempt at syncing. The server will respond with a 400 or 500 if the sync is unsuccessful.
