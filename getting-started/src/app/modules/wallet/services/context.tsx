"use client";
import {
  AlembicProvider,
  AlembicWallet,
} from "@alembic/account-abstraction-sdk";
import { ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const WalletContext = createContext<{
  wallet: AlembicWallet | null;
  setWallet: Dispatch<SetStateAction<AlembicWallet | null>>;
  provider: AlembicProvider | null;
  setProvider: Dispatch<SetStateAction<AlembicProvider | null>>;
  counterContract: ethers.Contract | null;
  setCounterContract: Dispatch<SetStateAction<any | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  counterContract: null,
  setCounterContract: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<AlembicWallet | null>(null);
  const [provider, setProvider] = useState<AlembicProvider | null>(null);
  const [counterContract, setCounterContract] =
    useState<ethers.Contract | null>(null);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        counterContract,
        setCounterContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
