// src/context/useAuth.js
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Giúp debug: nếu quên bọc AuthProvider thì sẽ nổ lỗi rõ ràng
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

