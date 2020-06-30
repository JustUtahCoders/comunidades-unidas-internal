# API Documentation

The comunidades-unidas-internal project is hosted on https://database.cuutah.org. It provides JSON REST APIs that may
be used by third party software systems.

## Authentication and Authorization

There are three methods of authentication: (1) Google OAuth2, (2) API key, and (3) automatic authentication during local development. Google OAuth is used for employees of Comunidades Unidas and should not be used for integration with other software systems. Instead, an API key should be used for those situations.

### Obtaining an API key

You may obtain an API key by contacting Comunidades Unidas directly.

### How to use your API key

To use your API key, send an HTTP header with your requests that looks like this:

```
Authorization: Basic <AUTH_TOKEN>
```

This uses HTTP Basic auth, as described in https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication. Your username and password are combined to form the AUTH_TOKEN.
