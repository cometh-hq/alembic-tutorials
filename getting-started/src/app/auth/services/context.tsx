"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

export const AuthContext = createContext<{
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}>({
  token: "",
  setToken: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [token, setToken] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
