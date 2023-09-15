"use client";

import {
  AlembicProvider,
  AlembicWallet,
  CustomAuthAdaptor,
} from "@alembic/account-abstraction-sdk";
import { useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { useAuthContext } from "@/app/auth/hooks/useAuthContext";
import { ethers } from "ethers";
import countContractAbi from "../../../../counterABI.json";

export function useWalletAuth() {
  const {
    setWallet,
    setProvider,
    wallet,
    provider,
    nftContract,
    setNftContract,
    setUserNftBalance,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { token } = useAuthContext();

  const apiKey = process.env.NEXT_PUBLIC_ALEMBIC_API_KEY!;
  const TEST_NFT_CONTRACT_ADDRESS =
    "0x84add3fa2c2463c8cf2c95ad70e4b5f602332160";

  function displayError(message: string) {
    setConnectionError(message);
  }

  async function connect() {
    setIsConnecting(true);
    try {
      const walletAdaptor = new CustomAuthAdaptor("0x89", token, apiKey);

      const instance = new AlembicWallet({
        authAdapter: walletAdaptor,
        apiKey,
      });

      const instanceProvider = new AlembicProvider(instance);

      await instance.connect();

      const contract = new ethers.Contract(
        TEST_NFT_CONTRACT_ADDRESS,
        countContractAbi,
        instanceProvider.getSigner()
      );

      setNftContract(contract);

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
        setUserNftBalance(null);
        setWallet(null);
        setProvider(null);
        setNftContract(null);
      } catch (e) {
        displayError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    nftContract,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
