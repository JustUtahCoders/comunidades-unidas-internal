import React, { useState } from "react";
import { UserContext } from "./user.context";

export const UserModeContext = React.createContext<UserModeContextType>(null);

export default function UserModeContextComponent(props) {
  const user = React.useContext(UserContext);
  const [userMode, setUserMode] = React.useState(() => {
    const localStorageMode = localStorage.getItem("user-mode");
    if (user.permissions.immigration) {
      if (localStorageMode === null) {
        return UserMode.immigration;
      } else {
        return localStorageMode === "immigration"
          ? UserMode.immigration
          : UserMode.normal;
      }
    } else {
      return UserMode.normal;
    }
  });

  const value = { userMode, setUserMode: setUserModeWithLocalStorage };

  return (
    <UserModeContext.Provider value={value}>
      {props.children}
    </UserModeContext.Provider>
  );

  function setUserModeWithLocalStorage(mode: UserMode) {
    setUserMode(mode);
    localStorage.setItem("user-mode", mode);
  }
}

export type UserModeContextType = {
  userMode: UserMode;
  setUserMode(mode: UserMode): void;
};

export enum UserMode {
  normal = "normal",
  immigration = "immigration",
}
