# Send a bulk SMS text

This API allows you to send a bulk text to clients and leads.

## Request

```http
POST /api/bulk-texts?zip=84103
```

### Notes

- The query parameters for this API are exactly the same as for [the list clients api](/api-docs/list-clients.md).

## Response

```json
{
  "clientsMatched": 10,
  "clientsWithPhone": 8,
  "uniquePhoneNumbers": 7
}
```
