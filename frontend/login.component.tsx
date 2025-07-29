import * as base64ArrayBuffer from "base64-arraybuffer";
import React from "react";
import easyFetch from "./util/easy-fetch";
import { GrowlType, showGrowl } from "./growls/growls.component";
import { useCss } from "kremling";

export default function Login() {
  const [usersLoaded, setUsersLoaded] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const scope = useCss(css);
  const [registeringUser, setRegisteringUser] = React.useState(false);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/user-select`, { signal: ac.signal })
      .then((r) => {
        setUsers(r.users);
        setUsersLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        showGrowl({
          type: GrowlType.error,
          message: "Error fetching users",
        });
      });

    return () => {
      ac.abort();
    };
  }, []);

  React.useEffect(() => {
    if (registeringUser) {
      const newUserName = "First User";
      const ac = new AbortController();
      easyFetch(`/register-user?name=${encodeURIComponent(newUserName)}`, {
        signal: ac.signal,
      }).then((attestationOptions) => {
        attestationOptions.user.id = base64ArrayBuffer.decode(
          attestationOptions.user.id
        );
        attestationOptions.challenge = base64ArrayBuffer.decode(
          attestationOptions.challenge
        );
        const name = newUserName.split(" ");
        return navigator.credentials
          .create({ publicKey: attestationOptions })
          .then((credential) => {
            return easyFetch(`/register-user`, {
              method: "POST",
              body: {
                firstName: name[0],
                lastName: name.length > 1 ? name[1] : "",
                credential: {
                  id: credential.id,
                  // @ts-expect-error
                  rawId: base64ArrayBuffer.encode(credential.rawId),
                  response: {
                    clientDataJSON: base64ArrayBuffer.encode(
                      // @ts-expect-error
                      credential.response.clientDataJSON
                    ),
                    attestationObject: base64ArrayBuffer.encode(
                      // @ts-expect-error
                      credential.response.attestationObject
                    ),
                  },
                  type: credential.type,
                },
              },
            });
          })
          .then(() => {
            setRegisteringUser(false);
            showGrowl({
              message: "User created",
              type: GrowlType.success,
            });
            // setTimeout(() => {
            //   window.location.reload();
            // });
          })
          .catch((err) => {
            console.error(err);
            showGrowl({
              message:
                "Failed to retrieve public key from hardware security key",
              type: GrowlType.error,
            });
          });
      });
    }
  });

  React.useEffect(() => {
    if (selectedUser) {
      window["navigatorCredentialsOptions"].challenge =
        base64ArrayBuffer.decode(
          window["navigatorCredentialsOptions"].challenge
        );

      navigator.credentials
        .get({ publicKey: window["navigatorCredentialsOptions"] })
        .then((credential) => {
          console.log("userHandle", credential);
          return easyFetch(`/login`, {
            method: "POST",
            body: {
              userId: selectedUser,
              challenge: base64ArrayBuffer.encode(
                window["navigatorCredentialsOptions"].challenge
              ),
              credential: {
                id: credential.id,
                // @ts-expect-error
                rawId: base64ArrayBuffer.encode(credential.rawId),
                response: {
                  authenticatorData: base64ArrayBuffer.encode(
                    // @ts-expect-error
                    credential.response.authenticatorData
                  ),
                  clientDataJSON: base64ArrayBuffer.encode(
                    // @ts-expect-error
                    credential.response.clientDataJSON
                  ),
                  signature: base64ArrayBuffer.encode(
                    // @ts-expect-error
                    credential.response.signature
                  ),
                  userHandle: base64ArrayBuffer.encode(
                    // @ts-expect-error
                    credential.response.userHandle
                  ),
                },
                type: credential.type,
              },
            },
          });
        })
        .then(() => {
          // setTimeout(() => {
          //   location.reload();
          // }, 3000);
        })
        .catch((err) => {
          console.error(err);
          showGrowl({
            type: GrowlType.error,
            message:
              "Hardware key authentication not successful. Wrong key or user?",
          });
          setSelectedUser(null);
        });
    }
  }, [selectedUser]);

  return (
    <div {...scope}>
      <h1 className="header">Login to CU Database</h1>
      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td onClick={() => setSelectedUser(user.id)}>{user.id}</td>
              <td onClick={() => setSelectedUser(user.id)}>
                {user.firstName} {user.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {usersLoaded && users.length === 0 && (
        <button onClick={registerUser}>Register User</button>
      )}
    </div>
  );

  function registerUser() {
    setRegisteringUser(true);
  }
}

const css = `
& .table {
  margin: 20px auto 0 auto;
  background-color: lightgray;
}

& .table td, .table th {
  padding: 20px;
  border: 1px solid black;
}

& .table td {
  cursor: pointer;
}

& .header {
  margin: 0 auto;
}

& button {
  margin: 0 auto;
}
`;
