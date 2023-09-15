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
  nftContract: ethers.Contract | null;
  setNftContract: Dispatch<SetStateAction<any | null>>;
  userNftBalance: any | null;
  setUserNftBalance: Dispatch<SetStateAction<any | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  nftContract: null,
  setNftContract: () => {},
  userNftBalance: null,
  setUserNftBalance: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<AlembicWallet | null>(null);
  const [provider, setProvider] = useState<AlembicProvider | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [userNftBalance, setUserNftBalance] = useState<number | null>(null);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        nftContract,
        setNftContract,
        userNftBalance,
        setUserNftBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
