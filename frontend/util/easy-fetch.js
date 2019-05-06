export default function easyFetch(url, opts = {}) {
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
      return response.json();
    } else {
      return response
        .json()
        .then(json => {
          const err = Error(
            `Api request to '${url}' failed with HTTP status ${response.status}`
          );
          err.body = json;
          throw err;
        })
        .catch(err => {
          throw Error(
            `Api request to '${url}' failed with HTTP status ${response.status}`
          );
        });
    }
  });
}
