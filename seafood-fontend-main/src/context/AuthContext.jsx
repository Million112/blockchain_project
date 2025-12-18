// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem('user');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const login = (data) => {
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data));
//     setUser(data.user);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // src/context/AuthContext.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api/client";
// import { AuthContext } from "./useAuth";

// export function AuthProvider({ children }) {
//   const [auth, setAuth] = useState({
//     token: null,
//     username: null,
//     role: null,
//     loading: true,
//   });

//   useEffect(() => {
//     const raw = localStorage.getItem("auth");
//     if (raw) {
//       try {
//         const parsed = JSON.parse(raw);
//         setAuth({ ...parsed, loading: false });
//       } catch {
//         setAuth((prev) => ({ ...prev, loading: false }));
//       }
//     } else {
//       setAuth((prev) => ({ ...prev, loading: false }));
//     }
//   }, []);

//   const login = async (username, password) => {
//     const res = await api.post("/auth/login", { username, password });
//     const data = res.data; // { token, username, role }
//     const stored = {
//       token: data.token,
//       username: data.username,
//       role: data.role,
//     };
//     localStorage.setItem("auth", JSON.stringify(stored));
//     setAuth({ ...stored, loading: false });
//   };

//   const logout = () => {
//     localStorage.removeItem("auth");
//     setAuth({ token: null, username: null, role: null, loading: false });
//   };

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



// import React, { createContext, useEffect, useState } from "react";
// import api from "../api/client";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [auth, setAuth] = useState({
//     token: null,
//     username: null,
//     role: null,
//     loading: true,
//   });

//   useEffect(() => {
//     const raw = localStorage.getItem("auth");
//     if (raw) {
//       try {
//         const parsed = JSON.parse(raw);
//         setAuth({ ...parsed, loading: false });
//       } catch {
//         setAuth((prev) => ({ ...prev, loading: false }));
//       }
//     } else {
//       setAuth((prev) => ({ ...prev, loading: false }));
//     }
//   }, []);

//   const login = async (username, password) => {
//     const res = await api.post("/auth/login", { username, password });
//     const data = res.data; // { token, username, role }
//     const stored = {
//       token: data.token,
//       username: data.username,
//       role: data.role,
//     };
//     console.log("Storing auth:", stored);
//     localStorage.setItem("auth", JSON.stringify(stored));
//     setAuth({ ...stored, loading: false });
//     return stored; // 🔥 trả về cho Login dùng để điều hướng
//   };

//   const logout = () => {
//     localStorage.removeItem("auth");
//     setAuth({ token: null, username: null, role: null, loading: false });
//   };

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }




// src/context/AuthContext.jsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    username: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAuth({ ...parsed, loading: false });
      } catch {
        setAuth((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    const data = res.data; // { token, username, role, ... }

    const stored = {
      token: data.token,
      username: data.username,
      role: data.role,
    };

    localStorage.setItem("auth", JSON.stringify(stored));
    setAuth({ ...stored, loading: false });
    return stored; 
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth({
      token: null,
      username: null,
      role: null,
      loading: false,
    });
  };

  // value KHÔNG cần lồng auth bên trong nữa, cho thẳng ra luôn
  return (
    <AuthContext.Provider
      value={{
        ...auth,  // token, username, role, loading
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
