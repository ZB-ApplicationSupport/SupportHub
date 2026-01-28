import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

const defaultUser = {
  name: "Tariro Moyo",
  role: "Admin",
  department: "Case Operations",
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedRole = localStorage.getItem("case-tracker-role");
    return storedRole ? { ...defaultUser, role: storedRole } : defaultUser;
  });

  const setRole = (role) => {
    localStorage.setItem("case-tracker-role", role);
    setUser((prev) => ({ ...prev, role }));
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      setRole,
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
