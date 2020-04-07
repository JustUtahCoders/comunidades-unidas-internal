import React, { useState } from "react";
import cookies from "js-cookie";

export const UserContext = React.createContext(null);

export default function UserContextComponent(props) {
  const [user] = useState<LoggedInUser>(() =>
    JSON.parse(window.atob(cookies.get("user")))
  );

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
}

export type LoggedInUser = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  accessLevel: UserAccessLevel;
};

export enum UserAccessLevel {
  Administrator = "Administrator",
  Staff = "Staff",
}
