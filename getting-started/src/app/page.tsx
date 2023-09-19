"use client";

import React from "react";
import { Button } from "./lib/ui/components";
import { Web3 } from "./components/Web3";
import { useAuthContext } from "./modules/auth/hooks/useAuthContext";
import { useTokenAuth } from "./modules/auth/hooks/useTokenAuth";

export default function App() {
  const { token } = useAuthContext();
  const { getToken, userId, setUserId } = useTokenAuth();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!token && (
        <div>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-1/2 md:w-fit h-[32px] shrink rounded-full placeholder:text-xs placeholder:italic px-2 placeholder:opacity-50 font-semibold focus:outline-none"
            placeholder="Nickname..."
          />

          <Button onClick={getToken} variant="default">
            Identify
          </Button>
        </div>
      )}
      {token && <Web3 />}
    </div>
  );
}
