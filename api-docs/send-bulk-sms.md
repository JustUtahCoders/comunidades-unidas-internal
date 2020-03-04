# Check bulk SMS text

This API allows you to see what sending a bulk SMS **would do**. Note that bulk texts are sent to both clients and leads.

## Request

```http
POST /api/check-bulk-texts?zip=84103
```

### Notes

- The query parameters for this API are exactly the same as for [the list clients api](/api-docs/list-clients.md) and the list leads api.

## Response

```json
{
  "clientsMatched": 10,
  "leadsMatched": 2,
  "uniquePhoneNumbers": 7
}
```

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
  "leadsMatched": 2,
  "uniquePhoneNumbers": 7
}
```
