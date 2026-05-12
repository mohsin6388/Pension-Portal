import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // const login = (username, password) => {
  //   if (username && password) {
  //     setUser({ name: 'Admin User', org: 'Kanpur Municipal Corporation', username });
  //     return true;
  //   }
  //   return false;
  // };

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
