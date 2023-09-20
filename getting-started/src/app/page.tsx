"use client";

import React, { useEffect, useState } from "react";
import { Button, Icons } from "./lib/ui/components";
import { signIn, signOut, useSession } from "next-auth/react";
import { Web3 } from "./components/Web3";

export default function App() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

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
      <div>
        {session ? (
          <Button variant="outline" type="button" onClick={() => signOut()}>
            Disconnect ({session.user?.email})
          </Button>
        ) : (
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signIn("google", { callbackUrl: "/login" })}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            {"Connect with Google"}
          </Button>
        )}
      </div>
      {session && <Web3 />}
    </div>
  );
}
