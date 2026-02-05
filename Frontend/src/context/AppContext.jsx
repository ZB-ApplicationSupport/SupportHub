import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem("case-tracker-user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.name && parsed.role ? parsed : null;
  } catch (error) {
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadStoredUser());

  const setRole = (role) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      const next = { ...prev, role };
      localStorage.setItem("case-tracker-user", JSON.stringify(next));
      return next;
    });
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("case-tracker-user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("case-tracker-user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser: updateUser,
      setRole,
      logout,
    }),
    [user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
