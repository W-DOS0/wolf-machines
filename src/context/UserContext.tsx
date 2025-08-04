import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showUser, setShowUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  function logout() {
    setUser(null);
    setShowUser(false);
    setShowLogin(true);  // Login nach Logout anzeigen
  }

  return (
    <UserContext.Provider value={{ user, setUser, showUser, setShowUser, showLogin, setShowLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
