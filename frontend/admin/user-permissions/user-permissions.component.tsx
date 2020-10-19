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

export default function UserPermissions(props: UserPermissionsProps) {
  const loggedInUser = React.useContext<LoggedInUser>(UserContext);
  const canView = loggedInUser.accessLevel === UserAccessLevel.Administrator;

  const [users, setUsers] = React.useState<User[]>([]);
  const [shouldRefetch, setShouldRefetch] = React.useState(true);
  const [userToEdit, setUserToEdit] = React.useState(null);

  React.useEffect(() => {
    if (canView && shouldRefetch) {
      const ac = new AbortController();
      easyFetch(`/api/users`, { signal: ac.signal })
        .then((r) => setUsers(r.users))
        .catch(handlePromiseError)
        .finally(() => {
          setShouldRefetch(false);
        });
    }
  }, [canView, shouldRefetch]);

  if (!canView) {
    return <NotFound path={props.path} />;
  }

  return (
    <>
      <PageHeader title="User Permissions" />
      <div className="card">
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
                  <td style={{ fontSize: "1.4rem" }}>{user.email}</td>
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
