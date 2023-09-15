import { useContext } from "react";
import { AuthContext } from "@/app/modules/auth/services/context";

export function useAuthContext() {
  const { token, setToken } = useContext(AuthContext);
  return {
    token,
    setToken,
  };
}