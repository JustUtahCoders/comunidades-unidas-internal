const bcrypt = require("bcrypt");

let readStdinResolve;

(async () => {
  console.log("Raw text password:");
  const rawTextPassword = await readStdin();
  const passwordHash = await generatePasswordHash(rawTextPassword);
  console.log("Password hash:");
  console.log(passwordHash);
  process.exit(0);
})();

async function generatePasswordHash(rawTextPassword) {
  // This is bcrypt's default, but must be specified when calling certain methods
  const saltRounds = 10;

  return bcrypt.hash(rawTextPassword, saltRounds);
}

process.stdin.on("readable", () => {
  let str = "";
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    str += chunk;
  }

  if (typeof readStdinResolve === "function") {
    readStdinResolve(str.trim());
  }
});

function readStdin() {
  return new Promise((resolve) => {
    readStdinResolve = resolve;
  });
}
