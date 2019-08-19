export default function easyFetch(url: string, opts?: any) {
  if (!opts) {
    opts = {};
  }

  if (!opts.headers) {
    opts.headers = {};
  }

  if (opts.method && opts.method.toUpperCase() !== "GET") {
    opts.headers["Content-Type"] = "application/json";
  }

  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
  }

  return window.fetch(url, opts).then(response => {
    if (response.ok) {
      if (response.status === 204) {
        return null;
      } else {
        return response.json();
      }
    } else {
      return response
        .json()
        .then(json => {
          const err = new FetchError(
            `Api request to '${url}' failed with HTTP status ${response.status}`
          );
          err.body = json;
          err.status = response.status;
          throw err;
        })
        .catch(err => {
          const errorObject = new FetchError(
            `Api request to '${url}' failed with HTTP status ${response.status}`
          );
          errorObject.status = response.status;
          throw errorObject;
        });
    }
  });
}

// @ts-ignore
window.debugFetch = easyFetch;

class FetchError extends Error {
  body?: string;
  status?: number;
}
