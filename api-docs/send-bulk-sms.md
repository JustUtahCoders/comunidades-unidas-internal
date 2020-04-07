# Check bulk SMS text

This API allows you to see what sending a bulk SMS **would do**. Note that bulk texts are sent to both clients and leads.

## Request

```http
POST /api/check-bulk-texts?zip=84103
```

## Response

```json
{
  "searchMatch": {
    "clients": clientRows.length,
    "leads": leadRows.length
  },
  "withPhone": {
    "clients": clientsWithPhones.length,
    "leads": leadsWithPhones.length
  },
  "recipients": {
    "clients": clientRecipients.length,
    "leads": leadRecipients.length,
    "uniquePhoneNumbers": phoneNumbers.length
  }
}
```

### Notes

- The query parameters for this API are exactly the same as for [the list clients api](/api-docs/list-clients.md) and the list leads api.
- The `searchMatch` results include clients and leads who don't have a valid phone and/or have not given SMS consent.
- The `withPhone` results include clients and leads who have not given SMS consent.

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
  "searchMatch": {
    "clients": clientRows.length,
    "leads": leadRows.length
  },
  "withPhone": {
    "clients": clientsWithPhones.length,
    "leads": leadsWithPhones.length
  },
  "recipients": {
    "clients": clientRecipients.length,
    "leads": leadRecipients.length,
    "uniquePhoneNumbers": phoneNumbers.length
  }
}
```
