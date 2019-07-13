# API Documentation

The comunidades-unidas-internal project is hosted on https://database.cuutah.org. It provides JSON REST APIs that may
be used by third party software systems.

## Authentication and Authorization

There are two methods of authentication: (1) Google OAuth2 and (2) API key. Google OAuth is used for employees of Comunidades Unidas
and should not be used for integration with other software systems. Instead, an API key should be used for those situations.

### Obtaining an API key

You may obtain an API key by contacting Comunidades Unidas directly.

### How to use your API key

To use your API key, send an HTTP header with your requests that looks like this:

```
Authorization: Basic YOUR_API_KEY
```

This is all you need to authenticate and authorize
