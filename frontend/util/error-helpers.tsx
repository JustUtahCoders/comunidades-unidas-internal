export function handlePromiseError(err) {
  setTimeout(() => {
    throw err;
  });
}
