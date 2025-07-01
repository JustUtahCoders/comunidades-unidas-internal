import React from "react";
import NotFound from "../../not-found/not-found.component";
import PageHeader from "../../page-header.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import { capitalize } from "../../reports/shared/report.helpers";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";
import {
  LoggedInUser,
  UserAccessLevel,
  UserContext,
} from "../../util/user.context";
import EditUser from "./edit-user.component";
import Modal from "../../util/modal.component";
import * as base64ArrayBuffer from "base64-arraybuffer";
import { GrowlType, showGrowl } from "../../growls/growls.component";

export default function UserPermissions(props: UserPermissionsProps) {
  const loggedInUser = React.useContext<LoggedInUser>(UserContext);
  const canView = loggedInUser.accessLevel === UserAccessLevel.Administrator;

  const [users, setUsers] = React.useState<User[]>([]);
  const [shouldRefetch, setShouldRefetch] = React.useState(true);
  const [userToEdit, setUserToEdit] = React.useState(null);
  const [registerModal, setRegisterModal] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState("");
  const [registeringUser, setRegisteringUser] = React.useState(false);

  React.useEffect(() => {
    if (canView && shouldRefetch) {
      const ac = new AbortController();
      easyFetch(`/api/users`, { signal: ac.signal })
        .then((r) => setUsers(r.users))
        .catch(handlePromiseError)
        .finally(() => {
          setShouldRefetch(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [canView, shouldRefetch]);

  React.useEffect(() => {
    if (registeringUser) {
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
        navigator.credentials
          .create({ publicKey: attestationOptions })
          .then((credential) => {
            return easyFetch(`/register-user`, {
              method: "POST",
              body: {
                firstName: name[0],
                lastName: name.length > 1 ? name[1] : "",
                challenge: base64ArrayBuffer.encode(
                  attestationOptions.challenge
                ),
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
            setNewUserName("");
            setRegisterModal(null);
            setShouldRefetch(true);
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

  if (!canView) {
    return <NotFound path={props.path} />;
  }

  return (
    <>
      {registerModal && (
        <Modal
          headerText="Register new user"
          close={() => setRegisterModal(false)}
          primaryText="Register"
          primaryAction={() => setRegisteringUser(true)}
          secondaryText="Cancel"
          secondaryAction={() => setRegisterModal(false)}
        >
          <label>
            <div>User's name</div>
            <input
              autoFocus
              type="text"
              value={newUserName}
              onChange={(evt) => setNewUserName(evt.target.value)}
              placeholder="Test User"
            />
          </label>
        </Modal>
      )}
      <PageHeader title="User Permissions" />
      <div className="card">
        <button type="button" onClick={() => setRegisterModal(true)}>
          Register new user
        </button>
        <BasicTableReport
          tableStyle={{ width: "100%" }}
          headerRows={
            <tr>
              <th style={{ width: "8%" }}>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Permissions</th>
            </tr>
          }
          contentRows={
            <>
              {users.map((user) => (
                <tr
                  role="button"
                  tabIndex={0}
                  className="clickable"
                  key={user.id}
                  onClick={() => setUserToEdit(user)}
                >
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td
                    style={{
                      fontSize: "1.4rem",
                      textWrap: "nowrap",
                      overflowX: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.email}
                  </td>
                  <td>{displayPermissions(user)}</td>
                </tr>
              ))}
            </>
          }
        />
      </div>
      {userToEdit && <EditUser user={userToEdit} close={closeEdit} />}
    </>
  );

  function closeEdit(shouldRefetch: boolean) {
    setUserToEdit(null);
    setShouldRefetch(shouldRefetch);
  }
}

function displayPermissions(user: User) {
  const enabledPermissions = Object.entries(user.permissions)
    .filter(([permName, enabled]) => enabled)
    .map(([permName]) => permName);
  // @ts-ignore
  const perms = [user.accessLevel].concat(enabledPermissions).map(capitalize);
  return perms.join(", ");
}

type UserPermissionsProps = {
  path: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  permissions: UserPermissions;
  accessLevel: UserAccessLevel;
  email: string;
};

export type UserPermissions = {
  immigration: boolean;
};
