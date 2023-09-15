import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export function useTokenAuth() {
  const { setToken } = useAuthContext();
  const [userId, setUserId] = useState<string>("");

  const getToken = async () => {
    try {
      if (userId === "") {
        throw new Error("not found");
      }

      const tokenResponse = await fetch(
        window.location.href + `api/token?userId=` + userId,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = await tokenResponse.json();
      setToken(token);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return {
    getToken,
    userId,
    setUserId,
  };
}
