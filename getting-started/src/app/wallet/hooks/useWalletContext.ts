import { useContext } from "react";
import { WalletContext } from "../services/context";

export function useWalletContext() {
  const {
    wallet,
    setWallet,
    provider,
    setProvider,
    nftContract,
    setNftContract,
    userNftBalance,
    setUserNftBalance,
  } = useContext(WalletContext);
  return {
    wallet,
    setWallet,
    provider,
    setProvider,
    nftContract,
    setNftContract,
    userNftBalance,
    setUserNftBalance,
  };
}
