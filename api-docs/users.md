# Users API

**This API is only available to admin users**

## List users

This api lists all CU staff members who use the system.

### Request

```
GET /api/users
```

### Response

```json
[
  {
    "id": 1,
    "firstName": "Test",
    "lastName": "User",
    "fullName": "Test User",
    "accessLevel": "Administrator",
    "email": "testuser@cuutah.org",
    "permissions": {
      "immigration": true
    }
  }
]
```

## Update permissions

To update the permissions for a user, send a PATCH request

### Request

```
PATCH /api/users/:id
```

```json
{
  "accessLevel": "Staff",
  "permissions": {
    "immigration": false
  }
}
```

**Notes:**

- Only the `accessLevel` and `permissions` fields are modifiable

### Response

```json
{
  "accessLevel": "Administrator",
  "permissions": {
    "immigration": true
  }
}
```
