"use client";

import { CheckCircle } from "react-feather";
import { Button } from "../lib/ui/components";
import { TransactionReceipt } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWalletAuth } from "../wallet/hooks/useWalletAuth";
import { useWindowSize } from "../lib/ui/hooks";

export function Transaction() {
  const { wallet, nftContract } = useWalletAuth();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionReceipt | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionFailure, setTransactionFailure] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [nftBalance, setNftBalance] = useState<number>(0);

  function TransactionButton({
    sendTestTransaction,
    isTransactionLoading,
  }: {
    sendTestTransaction: () => Promise<void>;
    isTransactionLoading: boolean;
  }) {
    return (
      <Button onClick={sendTestTransaction}>
        {isTransactionLoading && <CheckCircle />}
        Send Transaction
      </Button>
    );
  }

  useEffect(() => {
    if (wallet) {
      (async () => {
        const balance = await nftContract!.counters(wallet.getAddress());
        setNftBalance(Number(balance));
      })();
    }
  }, []);

  const sendTestTransaction = async () => {
    setIsTransactionLoading(true);
    try {
      if (!wallet) throw new Error("No wallet instance");

      const tx = await nftContract!.count();
      const txResponse = await tx.wait();

      const balance = await nftContract!.counters(wallet.getAddress());
      setNftBalance(Number(balance));

      setTransactionResponse(txResponse);
      setTransactionSuccess(true);
    } catch (e) {
      console.log("Error:", e);
      setTransactionFailure(true);
    }

    setIsTransactionLoading(false);
  };

  return (
    <main className="md:min-h-[70vh] flex justify-center items-center">
      {transactionSuccess && (
        <Confetti width={windowWidth} height={windowHeight} />
      )}
      <div>
        <>
          <div>Counter: {nftBalance}</div>
          <TransactionButton
            sendTestTransaction={sendTestTransaction}
            isTransactionLoading={isTransactionLoading}
          ></TransactionButton>
          {transactionResponse && <p>Transaction confirmed !</p>}
        </>

        {transactionSuccess && (
          <a
            rel="noopener noreferrer"
            href={`https://polygonscan.com/tx/${transactionResponse?.transactionHash}`}
            target="_blank"
          >
            Go see your transaction
          </a>
        )}
        {transactionFailure && <p>Transaction Failed !</p>}
      </div>
    </main>
  );
}
