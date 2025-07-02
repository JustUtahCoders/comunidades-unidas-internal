import * as base64ArrayBuffer from "base64-arraybuffer";
import React from "react";
import easyFetch from "./util/easy-fetch";
import { GrowlType, showGrowl } from "./growls/growls.component";
import { useCss } from "kremling";

export default function Login() {
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const scope = useCss(css);

  React.useEffect(() => {
    const ac = new AbortController();
    easyFetch(`/api/user-select`, { signal: ac.signal })
      .then((r) => setUsers(r.users))
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
    if (selectedUser) {
      window["navigatorCredentialsOptions"].challenge =
        base64ArrayBuffer.decode(
          window["navigatorCredentialsOptions"].challenge
        );

      navigator.credentials
        .get({ publicKey: window["navigatorCredentialsOptions"] })
        .then((credential) => {
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
          window.location.assign("/");
        })
        .catch((err) => {
          console.error(err);
          showGrowl({
            type: GrowlType.error,
            message:
              "Hardware key authentication not successful. Wrong key or user?",
          });
          setSelectedUser(null);
          setTimeout(() => {
            location.reload();
          }, 3000);
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
    </div>
  );
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
`;
