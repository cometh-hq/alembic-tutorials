"use client";

import { Button } from "../lib/ui/components";
import { CheckCircle } from "react-feather";

import React from "react";
import { Transaction } from "./Transaction";
import { useWalletAuth } from "../modules/wallet/hooks/useWalletAuth";

export function Web3() {
  const { isConnecting, isConnected, connect, connectionError } =
    useWalletAuth();
  function Connect() {
    return (
      <>
        {!connectionError ? (
          <Button onClick={connect}>
            {isConnecting && <CheckCircle />}
            Connect your Wallet
          </Button>
        ) : (
          <div>
            <p>Connection denied</p>
          </div>
        )}
      </>
    );
  }

  return (
    <main className="md:min-h-[70vh] flex justify-center items-center">
      {!isConnected ? <Connect /> : <Transaction />}
    </main>
  );
}
