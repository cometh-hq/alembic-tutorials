"use client";

import React from "react";
import { useSession } from "next-auth/react";
import ConnectGoogle from "./components/ConnectGoogle";
import { useWalletAuth } from "./modules/wallet/hooks/useWalletAuth";
import ConnectWallet from "./components/ConnectWallet";
import { Transaction } from "./components/Transaction";

export default function App() {
  const { data: session, status } = useSession();
  const { isConnecting, isConnected, connect, connectionError } =
    useWalletAuth();

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
      <div className="md:min-h-[70vh] gap-2 flex flex-col justify-center items-center">
        <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            {session && isConnected && <Transaction />}
            {session ? (
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                <ConnectWallet
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  connect={connect}
                  connectionError={connectionError}
                />
                <ConnectGoogle session={session} status={status} />
              </div>
            ) : (
              <div className="grid divide-x divide-gray-900/5 bg-gray-50">
                <ConnectGoogle session={session} status={status} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
