"use client";

import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
} from "@cometh/connect-sdk";
import { useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { ethers } from "ethers";
import countContractAbi from "../../contract/counterABI.json";
import { useSession } from "next-auth/react";

export function useWalletAuth() {
  const {
    setWallet,
    setProvider,
    wallet,
    counterContract,
    setCounterContract,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { data: session } = useSession();

  const apiKey = process.env.NEXT_PUBLIC_ALEMBIC_API_KEY!;
  const COUNTER_CONTRACT_ADDRESS = "0x84add3fa2c2463c8cf2c95ad70e4b5f602332160";

  function displayError(message: string) {
    setConnectionError(message);
  }

  async function connect() {
    setIsConnecting(true);
    try {
      const walletAdaptor = new ConnectAdaptor({
        chainId: "0x89",
        jwtToken: session?.accessToken as string,
        apiKey,
        baseUrl: "https://api.connect.develop.cometh.tech/",
      });

      const instance = new ComethWallet({
        authAdapter: walletAdaptor,
        apiKey,
        baseUrl: "https://api.connect.develop.cometh.tech/",
      });

      const instanceProvider = new ComethProvider(instance);

      await instance.connect();

      const contract = new ethers.Contract(
        COUNTER_CONTRACT_ADDRESS,
        countContractAbi,
        instanceProvider.getSigner()
      );

      setCounterContract(contract);

      setIsConnected(true);
      setWallet(instance as any);
      setProvider(instanceProvider as any);
    } catch (e) {
      displayError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    if (wallet) {
      try {
        await wallet!.logout();
        setIsConnected(false);
        setWallet(null);
        setProvider(null);
        setCounterContract(null);
      } catch (e) {
        displayError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    counterContract,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
